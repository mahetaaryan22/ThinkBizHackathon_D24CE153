/**
 * Customer Fit Engine
 * Calculates a fit score based on requirements vs specifications.
 */

function calculateCustomerFit(product, requirements) {
    let score = 0;
    let reasons = [];
    const specs = product.specifications || {};

    if (!requirements) return { score: 0, reasons: [] };

    // Brand preferences
    if (requirements.avoid && requirements.avoid.includes(product.brand)) {
        return { score: -100, reasons: [`Avoided brand: ${product.brand}`] }; // Dealbreaker
    }
    
    if (requirements.rejected_products && requirements.rejected_products.includes(product.name)) {
        return { score: -100, reasons: ['Previously rejected by customer'] };
    }

    if (requirements.preferences && requirements.preferences.includes(product.brand)) {
        score += 20;
        reasons.push(`Matches preferred brand: ${product.brand}`);
    }

    // OS Preferences
    if (specs.os && requirements.preferences && requirements.preferences.includes(specs.os)) {
        score += 30;
        reasons.push(`Matches preferred OS: ${specs.os}`);
    }

    // Use cases / Technical level mapping
    if (requirements.use_cases && requirements.use_cases.includes('programming')) {
        if (specs.ram_gb >= 16) {
            score += 20;
            reasons.push("Good RAM for programming");
        } else if (specs.ram_gb < 8) {
            score -= 20;
            reasons.push("Low RAM for programming");
        }
    }

    if (requirements.use_cases && requirements.use_cases.includes('gaming')) {
        if (specs.gpu && specs.gpu !== "Integrated") {
            score += 30;
            reasons.push("Dedicated GPU for gaming");
        } else {
            score -= 30;
            reasons.push("Integrated GPU may struggle with gaming");
        }
    }

    // Strong preferences / Must haves
    // Very simplified check: if must_have says "16GB RAM", we'd check specs. 
    // In a full NLP pipeline, we'd map "16GB RAM" to {ram_gb: 16}.
    
    return { score, reasons };
}

module.exports = { calculateCustomerFit };
