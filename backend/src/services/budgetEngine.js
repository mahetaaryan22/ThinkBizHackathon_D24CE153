/**
 * Budget Engine
 * Analyzes products against customer budget and determines if negotiation is needed.
 */

function analyzeBudget(products, budget) {
    if (!budget || (!budget.min && !budget.max)) {
        return {
            underBudget: products,
            negotiationCandidates: [],
            reasoning: "No budget constraints provided."
        };
    }

    const maxBudget = budget.max;
    const underBudget = [];
    const negotiationCandidates = [];

    products.forEach(product => {
        const price = parseFloat(product.price);
        if (price <= maxBudget) {
            underBudget.push(product);
        } else {
            // Check if it's within a reasonable extension range (e.g., up to 20% over)
            const diff = price - maxBudget;
            const percentDiff = (diff / maxBudget) * 100;
            
            if (percentDiff <= 20) {
                negotiationCandidates.push({
                    product,
                    diff,
                    percentDiff
                });
            }
        }
    });

    return {
        underBudget,
        negotiationCandidates: negotiationCandidates.sort((a, b) => a.percentDiff - b.percentDiff),
        reasoning: `Found ${underBudget.length} under budget and ${negotiationCandidates.length} potential upgrades.`
    };
}

module.exports = { analyzeBudget };
