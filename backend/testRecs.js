require('dotenv').config();
const { generateRecommendations } = require('./src/ai/recommendationEngine');

async function test() {
    const state = {
        goal: "gaming laptop",
        use_cases: ["gaming", "machine learning"],
        budget: { min: null, max: 150000, currency: "INR" },
        technical_level: "advanced",
        must_have: ["gpu"],
        avoid: ["chromebook"]
    };
    
    try {
        const recs = await generateRecommendations(state);
        console.log(JSON.stringify(recs, null, 2));
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

test();
