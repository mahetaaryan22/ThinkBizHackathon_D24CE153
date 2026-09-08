require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { Pool } = require('pg');

async function testConnection() {
    console.log("Trying with object config:");
    const pool1 = new Pool({
        user: 'postgres',
        password: 'Aryan@123',
        host: 'localhost',
        port: 5432,
        database: 'postgres'
    });

    try {
        await pool1.query('SELECT 1');
        console.log("Object config WORKED");
    } catch (e) {
        console.log("Object config FAILED", e.message);
    }
    await pool1.end();

    console.log("Trying with URL string config:");
    const pool2 = new Pool({
        connectionString: 'postgresql://postgres:Aryan%40123@localhost:5432/postgres'
    });

    try {
        await pool2.query('SELECT 1');
        console.log("URL string config WORKED");
    } catch (e) {
        console.log("URL string config FAILED", e.message);
    }
    await pool2.end();
}

testConnection();
