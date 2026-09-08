require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

async function initDb() {
    try {
        console.log('Running schema...');
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        await pool.query(schema);
        console.log('Schema executed successfully.');

        console.log('Running seed...');
        const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
        await pool.query(seed);
        console.log('Seed executed successfully.');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await pool.end();
    }
}

initDb();
