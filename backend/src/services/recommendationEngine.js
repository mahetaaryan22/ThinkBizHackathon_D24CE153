const db = require('../config/db');
const { rankProducts } = require('./rankingEngine');

/**
 * Main Recommendation Engine
 */
async function generateRecommendations(requirements) {
    // 1. Fetch relevant products based on goal or category
    // For simplicity in this demo, fetch all active products that roughly match the intent
    let query = 'SELECT * FROM products WHERE status = $1';
    let params = ['active'];
    let productsResult = await db.query(query, params);
    let products = productsResult.rows;

    // Filter roughly by intent/category if needed
    if (requirements.goal && requirements.goal.toLowerCase().includes('laptop')) {
        products = products.filter(p => p.category_id === 1);
    } else if (requirements.goal && requirements.goal.toLowerCase().includes('tv')) {
        products = products.filter(p => p.category_id === 3);
    }

    // 2. Rank Products
    const rankingResult = rankProducts(products, requirements);
    const { bestMatch, alternatives } = rankingResult;

    // 3. Fetch relationships (Shopping List) for the best match
    const shoppingList = [];
    if (bestMatch) {
        const relQuery = `
            SELECT r.relationship_type, p.* 
            FROM product_relationships r 
            JOIN products p ON r.target_product_id = p.id 
            WHERE r.source_product_id = $1
        `;
        const relResult = await db.query(relQuery, [bestMatch.id]);
        
        relResult.rows.forEach(rel => {
            shoppingList.push({
                type: rel.relationship_type,
                product: rel,
                reason: `This is a ${rel.relationship_type} addition to your ${bestMatch.name}.`
            });
        });
    }

    return {
        recommendations: bestMatch ? [bestMatch] : [],
        alternatives,
        shoppingList
    };
}

module.exports = { generateRecommendations };
