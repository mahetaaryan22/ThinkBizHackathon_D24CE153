const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-lite',
    generationConfig: {
        responseMimeType: "application/json",
    }
});

// Retry helper for transient 503/429 errors
async function callWithRetry(fn, maxRetries = 3, delayMs = 1500) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            const isRetryable = error.status === 503 || error.status === 429;
            if (isRetryable && attempt < maxRetries) {
                console.warn(`Gemini API busy (attempt ${attempt}/${maxRetries}), retrying in ${delayMs * attempt}ms...`);
                await new Promise(r => setTimeout(r, delayMs * attempt));
            } else {
                throw error;
            }
        }
    }
}

async function extractCustomerState(customerMessage, currentState) {
    const stateJson = JSON.stringify(currentState, null, 2);
    const prompt = `You are a friendly SALES ASSISTANT at an Electronics & Home store. Your ONLY job is to recommend the right product to buy. You are NOT a technical consultant, project advisor, or business coach.

CURRENT CUSTOMER STATE:
${stateJson}

CUSTOMER MESSAGE: "${customerMessage}"

YOUR CORE MISSION:
Ask ONLY questions that directly help pick the right product model. Every question must be about the PURCHASE DECISION, not about the customer's project, business, or work.

STORE INVENTORY CATEGORIES:
- Laptops (Gaming, Productivity, Budget)
- PC Components (CPUs, GPUs, RAM, SSDs, Motherboards)
- TVs (Smart TVs, OLED, QLED)
- Accessories (TV Mounts, Mice, Keyboards, Headphones, Cables)

ALLOWED QUESTIONS (these help choose a product):
- For Laptops: "Do you prefer Windows/Mac?", "Lightweight or powerful?", "What screen size?"
- For TVs: "What screen size are you looking for?", "OLED or standard?"
- For TV Mounts: "What size is your TV?", "Do you need a fixed, tilt, or full-motion mount?"
- For PC Parts: "What socket or generation are you looking for?"
- General: "What is your budget in INR?", "What will you primarily use this for?"

FORBIDDEN - NEVER ASK THESE (they are off-topic for buying):
- Never ask what app, software, or project the customer will build
- Never ask what programming language they will use
- Never ask technical details about their work or business
- Never give software or career recommendations

CONVERSATION STEPS - follow in order:
STEP 1: If goal is null, ask what product they are looking for (e.g. laptop, TV, TV mount, PC parts).
STEP 2: Once the goal is known, ask ONE clarifying preference question specific to that product (e.g. OS for laptops, motion type for TV mounts, size for TVs).
STEP 3: Ask: what is your budget in INR?
STEP 4: Set recommendation_ready = true when goal + at least 1 preference + budget are all known.

STRICT RULES:
- Ask only ONE question per response, maximum 2 short sentences.
- If the customer asks for a specific product (e.g., "I want a TV mount"), DO NOT ask them about laptops or try to change their mind. Accept it and ask a relevant question about the TV mount!
- If the customer already answered something, skip that step.
- Accept what they say and move on to the next purchase-related question.

Return ONLY this valid JSON with no markdown:
{
  "intent": "string",
  "updated_state": {
    "goal": "string or null",
    "use_cases": [],
    "budget": { "min": null, "max": null, "currency": "INR" },
    "technical_level": "beginner",
    "existing_products": [],
    "current_habits": [],
    "preferences": [],
    "must_have": [],
    "strong_preferences": [],
    "nice_to_have": [],
    "avoid": [],
    "environment": [],
    "constraints": [],
    "unknown_requirements": [],
    "rejected_products": []
  },
  "missing_requirements": [],
  "next_question": "string or null",
  "recommendation_ready": false
}`;

    try {
        const result = await callWithRetry(() => model.generateContent(prompt));
        const response = result.response.text();
        // Strip markdown code fences if present
        const cleaned = response
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/```\s*$/i, '')
            .trim();
        return JSON.parse(cleaned);
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error('Failed to parse customer state from AI');
    }
}

async function generateFinalResponse(currentState, recommendations) {
    if (!recommendations || recommendations.length === 0) {
        return "I couldn't find an exact match in our current inventory. Could you adjust your budget or requirements so I can look again?";
    }

    const stateJson = JSON.stringify(currentState, null, 2);
    const topRecs = recommendations.map(r => ({
        name: r.name,
        brand: r.brand,
        price: r.price,
        matchReasons: r.matchReasons
    }));

    const prompt = `You are a friendly laptop SALES ASSISTANT.
You have just found the best laptop recommendations for the customer.

CUSTOMER REQUIREMENTS:
${stateJson}

TOP RECOMMENDATION FOUND IN DATABASE:
${JSON.stringify(topRecs[0], null, 2)}

YOUR TASK:
Write a short, friendly message (1-3 sentences) presenting the recommendation. 
- If the customer explicitly asked for a specific brand or model (like "Vivobook" or "Asus") and the top recommendation is NOT that brand/model, you MUST explicitly tell them: "We don't currently have the [Requested Brand] in stock, but based on your needs, I highly recommend the [Found Model] because [reason]."
- Otherwise, just say you found a great match and briefly explain why it fits their needs.
- Keep it natural and conversational. DO NOT use markdown, bolding, or lists. Just plain text.`;

    try {
        const result = await callWithRetry(() => model.generateContent(prompt));
        let text = result.response.text().trim();
        
        // Sometimes Gemini returns JSON even when told not to. 
        // If it looks like JSON, try to extract the message.
        if (text.startsWith('{')) {
            try {
                const parsed = JSON.parse(text);
                if (parsed.message) text = parsed.message;
            } catch (e) {
                // Ignore parse errors, just use the raw text
            }
        }
        
        return text;
    } catch (error) {
        console.error('Gemini API Error (generateFinalResponse):', error);
        return "🎯 Great news! I found some excellent options tailored for you:";
    }
}

module.exports = {
    extractCustomerState,
    generateFinalResponse
};
