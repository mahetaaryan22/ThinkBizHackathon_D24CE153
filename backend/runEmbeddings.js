require('dotenv').config();
const { embedProducts } = require('./src/ai/embeddingService');

embedProducts().then(() => {
    console.log('Done');
    process.exit(0);
}).catch(console.error);
