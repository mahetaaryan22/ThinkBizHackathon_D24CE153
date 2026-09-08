const db = require('../config/db');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fallback to text-embedding-004 since gemini-2.5-flash is not an embedding model
const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

// Cosine similarity helper
function cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
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

async function generateEmbedding(text) {
    try {
        const result = await embedModel.embedContent(text);
        return result.embedding.values;
    } catch (e) {
        console.error("Embedding generation error:", e);
        return [];
    }
}

async function storeDocumentAndChunks(title, content, source) {
    // 1. Insert Document
    const docResult = await db.query(
        'INSERT INTO knowledge_documents (title, content, source) VALUES ($1, $2, $3) RETURNING id',
        [title, content, source]
    );
    const docId = docResult.rows[0].id;

    // 2. Simple Chunking (e.g., by double newline)
    const chunks = content.split('\n\n').filter(c => c.trim().length > 0);

    // 3. Generate Embeddings & Store
    for (const chunk of chunks) {
        const embedding = await generateEmbedding(chunk);
        // Store embedding as JSON string since we use JSONB
        await db.query(
            'INSERT INTO knowledge_chunks (document_id, content, embedding) VALUES ($1, $2, $3)',
            [docId, chunk, JSON.stringify(embedding)]
        );
    }
    return docId;
}

async function retrieveRelevantChunks(query, limit = 3) {
    const queryEmbedding = await generateEmbedding(query);
    if (!queryEmbedding.length) return [];

    const result = await db.query('SELECT * FROM knowledge_chunks WHERE embedding IS NOT NULL');
    
    const scoredChunks = result.rows.map(row => {
        // row.embedding is JSONB so it's already an array in pg driver if parsed, or we might need to parse
        const docVec = typeof row.embedding === 'string' ? JSON.parse(row.embedding) : row.embedding;
        const score = cosineSimilarity(queryEmbedding, docVec);
        return { ...row, score };
    });

    // Sort by descending score
    scoredChunks.sort((a, b) => b.score - a.score);
    
    // Return top chunks
    return scoredChunks.slice(0, limit);
}

module.exports = {
    generateEmbedding,
    storeDocumentAndChunks,
    retrieveRelevantChunks
};
