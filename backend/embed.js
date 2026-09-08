require('dotenv').config();
const { pool } = require('./src/config/db');
const { generateEmbedding } = require('./src/ai/embeddingService');

async function embedAll() {
    try {
        console.log('Fetching products...');
        const res = await pool.query('SELECT id, name, brand, specifications FROM products');
        for (const row of res.rows) {
            const text = `${row.name} ${row.brand} ${JSON.stringify(row.specifications)}`;
            const emb = await generateEmbedding(text);
            const embJson = JSON.stringify(emb);
            await pool.query('UPDATE products SET embedding = $1::jsonb WHERE id = $2', [embJson, row.id]);
            console.log('Embedded:', row.name);
        }
        console.log('Done.');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        pool.end();
    }
}
embedAll();
