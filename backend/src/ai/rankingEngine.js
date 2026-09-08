// Combines scores from different engines to produce a final ranked list
function rankProducts(products) {
    // Sort descending by final score
    products.sort((a, b) => b.finalScore - a.finalScore);
    
    // Categorize top products
    let primary = null;
    let alternatives = [];
    
    if (products.length > 0) {
        primary = products[0];
        alternatives = products.slice(1, 3); // top 2 alternatives
    }

    return { primary, alternatives };
}

module.exports = { rankProducts };
