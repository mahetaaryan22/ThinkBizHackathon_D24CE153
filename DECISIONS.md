# Decision Log

- Chose a full-stack setup with React for the frontend and Express for the backend because it is simple to build, easy to test, and good for a hackathon project. This gave us a fast user interface and a clean API layer for AI and database work.

- Used PostgreSQL as the main database because the project needs structured product data, categories, conversations, messages, and recommendation state. It is reliable, easy to query, and well-suited for storing product metadata and chat history.

- Integrated Google Gemini as the AI engine to understand user intent in natural language and create recommendation flows. This was a good choice because it reduced the need for complex rule-based parsing and allowed the app to feel more conversational.

- Built the recommendation flow around a lightweight AI + rules approach instead of a fully advanced ML pipeline. We use semantic matching, compatibility checks, budget checks, and customer-fit scoring together, which keeps the system understandable and faster to build.

- Decided to keep the product catalog and recommendation logic in a simple relational model rather than a full vector database. This made setup easier and reduced complexity, but it also means the semantic matching is lighter than a production-grade retrieval system.

- Kept the conversation logic focused on laptop buying decisions rather than general technical consulting. This was an important design choice to avoid confusing questions and to keep the AI aligned with the business goal of product recommendation.

- Used a single chat flow with state tracking, where each conversation stores user requirements and updates them over time. This helped maintain context across messages, but it also assumes the user is consistent and gives enough details for good recommendations.

- Chose a simple frontend with pages like Home, Chat, Products, and Admin because the app needed to show both customer and management use cases. The trade-off is that the UI is clean and functional, but not yet very advanced or deeply customized.

- Limited scope to a product recommendation use case instead of adding authentication, payment flow, or a full e-commerce system. This kept the project manageable and focused, but it means the app is not production-ready for real online shopping.

- If more time were available, we would improve the recommendation quality with stronger product data, better embeddings, user feedback learning, and a more polished admin dashboard. We would also add error handling, database validation, and deployment setup for a real-world product.
