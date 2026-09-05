const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { createReactAgent } = require("@langchain/langgraph/prebuilt");

const createProgressAgent = (userPreferences) => {
    let systemPrompt = "You are a specialized AI Data Analyst for fitness. Your primary job is to analyze workout logs, visualize trends, and provide weekly or monthly summary insights.\n";
    if (userPreferences) {
        systemPrompt += `\nUser Preferences:\n${userPreferences}`;
    }

    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-3.6-flash",
        temperature: 0,
        apiKey: process.env.GEMINI_API_KEY
    });

    const tools = []; // Add progress-specific tools here

    return createReactAgent({
        llm,
        tools,
        stateModifier: systemPrompt
    });
};

module.exports = { createProgressAgent };
