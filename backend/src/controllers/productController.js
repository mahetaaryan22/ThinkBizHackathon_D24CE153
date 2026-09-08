const db = require('../config/db');

exports.getAllProducts = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM products WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { category_id, name, brand, price, stock_quantity, status, specifications } = req.body;
        const query = `
            INSERT INTO products (category_id, name, brand, price, stock_quantity, status, specifications)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
        `;
        const { rows } = await db.query(query, [category_id, name, brand, price, stock_quantity, status, specifications || {}]);
        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_id, name, brand, price, stock_quantity, status, specifications } = req.body;
        const query = `
            UPDATE products 
            SET category_id = $1, name = $2, brand = $3, price = $4, stock_quantity = $5, status = $6, specifications = $7, updated_at = CURRENT_TIMESTAMP
            WHERE id = $8 RETURNING *
        `;
        const { rows } = await db.query(query, [category_id, name, brand, price, stock_quantity, status, specifications, id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { rowCount } = await db.query('DELETE FROM products WHERE id = $1', [id]);
        if (rowCount === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
