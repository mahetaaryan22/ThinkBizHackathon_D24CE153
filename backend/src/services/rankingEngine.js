/**
 * Ranking Engine
 * Ranks products based on customer fit, budget, and relationships.
 */
const { calculateCustomerFit } = require('./customerFitEngine');
const { analyzeBudget } = require('./budgetEngine');

function rankProducts(products, requirements) {
    // 1. Calculate fit score for all products
    const scoredProducts = products.map(product => {
        const { score, reasons } = calculateCustomerFit(product, requirements);
        return {
            ...product,
            fitScore: score,
            fitReasons: reasons
        };
    });

    // 2. Filter out dealbreakers
    const viableProducts = scoredProducts.filter(p => p.fitScore >= 0);

    // 3. Analyze budget
    const { underBudget, negotiationCandidates } = analyzeBudget(viableProducts, requirements.budget);

    // 4. Rank under-budget products
    const rankedUnderBudget = underBudget.sort((a, b) => b.fitScore - a.fitScore);

    // 5. Build Alternatives
    const alternatives = [];
    if (rankedUnderBudget.length > 1) {
        // Cheaper alternative
        const cheaper = [...rankedUnderBudget].sort((a, b) => parseFloat(a.price) - parseFloat(b.price))[0];
        if (cheaper.id !== rankedUnderBudget[0].id) {
            alternatives.push({ type: 'Cheaper Alternative', product: cheaper });
        }
    }

    if (negotiationCandidates.length > 0) {
        // Find a negotiation candidate that has a BETTER fit score than the best under-budget
        const bestUnderBudgetScore = rankedUnderBudget.length > 0 ? rankedUnderBudget[0].fitScore : -1;
        const betterCandidates = negotiationCandidates.filter(c => c.product.fitScore > bestUnderBudgetScore);
        
        if (betterCandidates.length > 0) {
            const bestUpgrade = betterCandidates.sort((a, b) => b.product.fitScore - a.product.fitScore)[0];
            alternatives.push({ type: 'Better Alternative (Over Budget)', product: bestUpgrade.product, budgetDiff: bestUpgrade.diff });
        } else if (rankedUnderBudget.length === 0) {
            // If nothing under budget, suggest the closest over-budget
            const closest = negotiationCandidates.sort((a, b) => a.percentDiff - b.percentDiff)[0];
            alternatives.push({ type: 'Closest Alternative (Over Budget)', product: closest.product, budgetDiff: closest.diff });
        }
    }

    return {
        bestMatch: rankedUnderBudget.length > 0 ? rankedUnderBudget[0] : null,
        alternatives,
        rankedUnderBudget
    };
}

module.exports = { rankProducts };
