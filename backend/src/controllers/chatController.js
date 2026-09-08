const db = require('../config/db');
const { extractCustomerState, generateFinalResponse } = require('../ai/geminiClient');
const { generateRecommendations } = require('../ai/recommendationEngine');

const getEmptyState = () => ({
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
});

exports.processChat = async (req, res) => {
    try {
        const { conversationId, message } = req.body;
        
        if (!conversationId || !message) {
            return res.status(400).json({ error: 'conversationId and message are required' });
        }

        // 1. Ensure conversation exists
        let convQuery = await db.query('SELECT * FROM conversations WHERE id = $1', [conversationId]);
        if (convQuery.rows.length === 0) {
            await db.query('INSERT INTO conversations (id) VALUES ($1)', [conversationId]);
        }

        // 2. Save user message
        await db.query('INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)', [conversationId, 'user', message]);

        // 3. Get current state
        let stateQuery = await db.query('SELECT state_json FROM customer_requirements WHERE conversation_id = $1', [conversationId]);
        let currentState = stateQuery.rows.length > 0 ? stateQuery.rows[0].state_json : getEmptyState();

        // 4. Run AI Orchestrator
        const aiResponse = await extractCustomerState(message, currentState);

        // 5. Save updated state
        if (stateQuery.rows.length > 0) {
            await db.query('UPDATE customer_requirements SET state_json = $1, updated_at = CURRENT_TIMESTAMP WHERE conversation_id = $2', [JSON.stringify(aiResponse.updated_state), conversationId]);
        } else {
            await db.query('INSERT INTO customer_requirements (conversation_id, state_json) VALUES ($1, $2)', [conversationId, JSON.stringify(aiResponse.updated_state)]);
        }

        // Debug: log what AI returned
        console.log('[AI Response]', {
            intent: aiResponse.intent,
            recommendation_ready: aiResponse.recommendation_ready,
            next_question: aiResponse.next_question,
            goal: aiResponse.updated_state?.goal,
            use_cases: aiResponse.updated_state?.use_cases,
        });

        // Strictly cast to boolean — Gemini sometimes returns the string "false"
        const isReady = aiResponse.recommendation_ready === true;

        let action = isReady ? 'SHOW_RECOMMENDATIONS' : 'ASK_QUESTION';
        // Fallback message so we never send a blank response
        let aiMessage = aiResponse.next_question
            || "Could you tell me a bit more about what you're looking for?";

        let recommendations = [];
        let alternatives = [];
        let shoppingList = [];

        if (isReady) {
            const recs = await generateRecommendations(aiResponse.updated_state);
            if (recs && recs.primary) {
                recommendations = [recs.primary];
                alternatives = recs.alternatives || [];
            }

            aiMessage = await generateFinalResponse(aiResponse.updated_state, recommendations);
            
            if (recommendations.length === 0) {
                action = 'ASK_QUESTION';
            }
        }

        // Save AI message
        if (aiMessage) {
            await db.query('INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)', [conversationId, 'assistant', aiMessage]);
        }

        res.json({
            conversationId,
            action,
            message: aiMessage,
            state: aiResponse.updated_state,
            recommendations,
            shoppingList,
            alternatives
        });

    } catch (error) {
        console.error('Chat processing error:', error);
        res.status(500).json({ error: 'Failed to process chat message' });
    }
};
