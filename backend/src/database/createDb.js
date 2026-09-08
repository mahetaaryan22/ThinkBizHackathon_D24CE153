require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { Pool } = require('pg');

async function createDb() {
    const connectionString = process.env.DATABASE_URL;
    
    // Quick fix: extract database name by splitting, and use the connection string but switch database to postgres
    const parts = connectionString.split('/');
    const dbName = parts.pop();
    const basePath = parts.join('/');
    
    const pool = new Pool({
        connectionString: basePath + '/postgres',
    });

    try {
        console.log(`Checking if database ${dbName} exists...`);
        const res = await pool.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${dbName}'`);
        
        if (res.rowCount === 0) {
            console.log(`Database ${dbName} does not exist. Creating...`);
            await pool.query(`CREATE DATABASE ${dbName}`);
            console.log(`Database ${dbName} created successfully.`);
        } else {
            console.log(`Database ${dbName} already exists.`);
        }
    } catch (error) {
        console.error('Error creating database:', error);
    } finally {
        await pool.end();
    }
}

createDb();
