require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModel(modelName) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName, generationConfig: { responseMimeType: 'application/json' } });
    try {
        const result = await model.generateContent('Return this JSON object: {"test": true, "greeting": "hello"}');
        console.log(modelName, '→ OK:', result.response.text().substring(0, 60));
    } catch (e) {
        console.log(modelName, '→ FAIL:', e.message.substring(0, 100));
    }
}

async function main() {
    await testModel('gemini-3.1-flash-lite');
    await testModel('gemini-flash-lite-latest');
    await testModel('gemini-2.5-flash-lite');
}
main();
