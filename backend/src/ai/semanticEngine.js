const { cosineSimilarity, generateEmbedding } = require('./embeddingService');
const db = require('../config/db');

async function getSemanticSimilarProducts(query, topK = 5) {
    const queryEmbedding = await generateEmbedding(query);
    
    // Fetch all products with their embeddings
    const res = await db.query(`
        SELECT id, name, brand, price, specifications, embedding
        FROM products
        WHERE embedding IS NOT NULL
    `);
    
    const products = res.rows;
    
    // Calculate similarities
    for (const product of products) {
        if (product.embedding) {
            product.similarity = cosineSimilarity(queryEmbedding, product.embedding);
        } else {
            product.similarity = 0;
        }
    }
    
    // Sort by similarity descending
    products.sort((a, b) => b.similarity - a.similarity);
    
    // Return top K
    return products.slice(0, topK);
}

module.exports = {
    getSemanticSimilarProducts
};
