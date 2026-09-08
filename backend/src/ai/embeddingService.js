const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../config/db');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateEmbedding(text) {
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
    const result = await model.embedContent(text);
    return result.embedding.values;
}

// Compute cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Function to generate and store embeddings for all products
async function embedProducts() {
    const res = await db.query(`
        SELECT p.id, p.name, p.brand, p.price, p.specifications, c.name as category_name
        FROM products p
        JOIN categories c ON p.category_id = c.id
    `);
    const products = res.rows;

    for (const product of products) {
        const textToEmbed = `
            Product: ${product.name}
            Brand: ${product.brand}
            Category: ${product.category_name}
            Price: ${product.price}
            Specifications: ${JSON.stringify(product.specifications)}
        `;
        const embedding = await generateEmbedding(textToEmbed);
        
        // We'll store the embedding in the products table. Let's ensure the column exists.
        await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS embedding JSONB`);
        
        // Update product with embedding
        await db.query(`UPDATE products SET embedding = $1 WHERE id = $2`, [JSON.stringify(embedding), product.id]);
        console.log(`Generated embedding for product ${product.id}`);
    }
    console.log("All products embedded successfully.");
}

module.exports = {
    generateEmbedding,
    cosineSimilarity,
    embedProducts
};
