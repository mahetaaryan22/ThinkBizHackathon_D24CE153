const { getSemanticSimilarProducts } = require('./semanticEngine');
const { evaluateCompatibility } = require('./compatibilityEngine');
const { evaluateBudget } = require('./budgetEngine');
const { evaluateCustomerFit } = require('./customerFitEngine');
const { rankProducts } = require('./rankingEngine');

async function generateRecommendations(state) {
    if (!state.goal && !state.use_cases.length) {
        return null; // Not enough info to recommend
    }

    // 1. Get initial candidates via Semantic Search
    let query = state.goal || "";
    if (state.use_cases.length > 0) {
        query += " for " + state.use_cases.join(", ");
    }
    
    // Fetch top 15 similar products to evaluate
    const candidates = await getSemanticSimilarProducts(query, 15);
    
    if (candidates.length === 0) return null;

    // 2. Score candidates with engines
    for (const product of candidates) {
        // Semantic score baseline (0 to 1)
        product.semanticScore = product.similarity || 0;
        product.finalScore = product.semanticScore * 2; // base weight
        product.matchReasons = [];

        // Compatibility
        const comp = evaluateCompatibility(product, state);
        product.finalScore *= comp.score;
        product.matchReasons.push(...comp.reasons);

        // Budget
        const budget = evaluateBudget(product, state);
        product.finalScore *= budget.score;
        product.matchReasons.push(...budget.reasons);

        // Customer Fit
        const fit = evaluateCustomerFit(product, state);
        product.finalScore *= fit.score;
        product.matchReasons.push(...fit.reasons);
    }

    // 3. Rank
    const ranked = rankProducts(candidates);

    return ranked;
}

module.exports = { generateRecommendations };
