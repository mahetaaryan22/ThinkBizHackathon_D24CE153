// Evaluates hardware compatibility (e.g., Mac vs PC, GPU needed for ML)
function evaluateCompatibility(product, state) {
    let score = 1.0;
    const reasons = [];

    const specs = product.specifications || {};
    const useCases = (state.use_cases || []).map(u => u.toLowerCase());

    if (useCases.includes('machine learning') || useCases.includes('gaming')) {
        if (!specs.gpu || specs.gpu.toLowerCase().includes('integrated')) {
            score *= 0.3; // penalize heavily
            reasons.push('Lacks dedicated GPU required for your use case');
        } else {
            score *= 1.2; // bonus
            reasons.push('Has dedicated GPU suitable for gaming/ML');
        }
    }

    if (state.unknown_requirements && state.unknown_requirements.includes('os_preference') === false) {
        // If they prefer Mac and it's not a Mac, penalize
        if (state.strong_preferences && state.strong_preferences.includes('macos')) {
            if (product.brand.toLowerCase() !== 'apple') {
                score *= 0.0; // incompatible
                reasons.push('Not a macOS device');
            }
        }
    }

    return { score, reasons };
}

module.exports = { evaluateCompatibility };
