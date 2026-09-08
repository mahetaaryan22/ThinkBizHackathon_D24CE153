// Evaluates how well a product matches customer preferences and technical level
function evaluateCustomerFit(product, state) {
    let score = 1.0;
    const reasons = [];

    const specs = product.specifications || {};
    
    // Technical Level Check
    if (state.technical_level === 'beginner') {
        if (specs.os === 'Linux' || specs.form_factor === 'Custom Build') {
            score *= 0.5;
            reasons.push('Might be too complex for a beginner');
        } else {
            score *= 1.1;
            reasons.push('User-friendly for beginners');
        }
    }

    // Must have / Avoid
    const mustHaves = state.must_have || [];
    for (const req of mustHaves) {
        if (JSON.stringify(specs).toLowerCase().includes(req.toLowerCase())) {
            score *= 1.3;
            reasons.push(`Meets must-have requirement: ${req}`);
        } else {
            score *= 0.6;
            reasons.push(`Missing must-have requirement: ${req}`);
        }
    }

    const avoids = state.avoid || [];
    for (const avoid of avoids) {
        if (JSON.stringify(specs).toLowerCase().includes(avoid.toLowerCase())) {
            score *= 0.1;
            reasons.push(`Contains avoided feature: ${avoid}`);
        }
    }

    return { score, reasons };
}

module.exports = { evaluateCustomerFit };
