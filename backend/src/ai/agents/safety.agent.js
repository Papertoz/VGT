const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { createReactAgent } = require("@langchain/langgraph/prebuilt");

const createSafetyAgent = (userPreferences) => {
    let systemPrompt = "You are a specialized AI Safety Evaluator. Your primary job is to evaluate user input for injury risks, overtraining, and medical red flags. You act as a safeguard.\n";
    if (userPreferences) {
        systemPrompt += `\nUser Preferences:\n${userPreferences}`;
    }

    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-3.6-flash",
        temperature: 0,
        apiKey: process.env.GEMINI_API_KEY
    });

    const tools = []; // Add safety-specific tools here

    return createReactAgent({
        llm,
        tools,
        stateModifier: systemPrompt
    });
};

module.exports = { createSafetyAgent };
