/**
 * Compatibility Engine
 * Deterministic compatibility checking based on product specs.
 */

function checkCompatibility(productA, productB) {
    const specsA = productA.specifications || {};
    const specsB = productB.specifications || {};

    // CPU and Motherboard
    if (specsA.type === 'CPU' && specsB.type === 'Motherboard') {
        return specsA.socket === specsB.socket;
    }
    if (specsB.type === 'CPU' && specsA.type === 'Motherboard') {
        return specsB.socket === specsA.socket;
    }

    // Motherboard and RAM
    if (specsA.type === 'Motherboard' && specsB.type === 'RAM') {
        return specsA.ram_type === specsB.generation;
    }
    if (specsB.type === 'Motherboard' && specsA.type === 'RAM') {
        return specsB.ram_type === specsA.generation;
    }

    // TV and Mount
    if (productA.category_id === 3 && productB.category_id === 4) {
        // A is TV, B is Mount
        if (specsA.screen_size_inch >= specsB.min_size && specsA.screen_size_inch <= specsB.max_size) {
            return true;
        }
        return false;
    }
    if (productB.category_id === 3 && productA.category_id === 4) {
        // B is TV, A is Mount
        if (specsB.screen_size_inch >= specsA.min_size && specsB.screen_size_inch <= specsA.max_size) {
            return true;
        }
        return false;
    }

    return null; // Compatibility could not be verified from available data
}

module.exports = { checkCompatibility };
