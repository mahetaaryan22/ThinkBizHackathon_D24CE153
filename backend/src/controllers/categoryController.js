const db = require('../config/db');

exports.getAllCategories = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM categories');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Category not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch category' });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const query = `INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *`;
        const { rows } = await db.query(query, [name, description]);
        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
    }
};
