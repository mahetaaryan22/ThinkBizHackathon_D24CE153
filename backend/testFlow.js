require('dotenv').config();
const { extractCustomerState } = require('./src/ai/geminiClient');

async function test() {
    const emptyState = {
        goal: null,
        use_cases: [],
        budget: { min: null, max: null, currency: "INR" },
        technical_level: "basic",
        existing_products: [],
        current_habits: [],
        preferences: [],
        must_have: [],
        strong_preferences: [],
        nice_to_have: [],
        avoid: [],
        environment: [],
        constraints: [],
        unknown_requirements: [],
        rejected_products: []
    };

    console.log("--- Turn 1: User says 'I need a new laptop' ---");
    try {
        const turn1 = await extractCustomerState("I need a new laptop", emptyState);
        console.log("Next question:", turn1.next_question);
        console.log("recommendation_ready:", turn1.recommendation_ready);
        console.log("Intent:", turn1.intent);
        
        console.log("\n--- Turn 2: User says 'For programming and data science' ---");
        const turn2 = await extractCustomerState("For programming and data science", turn1.updated_state);
        console.log("Next question:", turn2.next_question);
        console.log("recommendation_ready:", turn2.recommendation_ready);
    } catch(e) {
        console.error(e.message);
    }
    process.exit(0);
}
test();
