// Evaluates how well a product fits the budget
function evaluateBudget(product, state) {
    let score = 1.0;
    const reasons = [];
    
    if (!state.budget) return { score, reasons };

    const { min, max } = state.budget;
    const price = Number(product.price);

    if (max && price > max) {
        // If it's slightly over budget (e.g. 10%), it might still be a good alternative
        const overage = (price - max) / max;
        if (overage <= 0.15) {
            score *= 0.8;
            reasons.push('Slightly over budget but worth considering');
        } else {
            score *= 0.1; // heavily penalize but keep as possible alternative if it's the only one
            reasons.push('Significantly over budget');
        }
    } else if (min && price < min) {
        score *= 0.5; // might be too cheap/low quality for their needs
        reasons.push('Below minimum budget, might not meet all needs');
    } else if (max && price <= max) {
        // Perfect fit
        score *= 1.2;
        reasons.push('Fits comfortably within budget');
    }

    return { score, reasons };
}

module.exports = { evaluateBudget };
