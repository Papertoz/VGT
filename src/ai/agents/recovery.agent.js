const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { createReactAgent } = require("@langchain/langgraph/prebuilt");

const createRecoveryAgent = (userPreferences) => {
    let systemPrompt = "You are a specialized AI Recovery Coach. Your primary job is to suggest rest days, stretching routines, sleep advice, and monitor fatigue based on the user's fitness activity.\n";
    if (userPreferences) {
        systemPrompt += `\nUser Preferences:\n${userPreferences}`;
    }

    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-3.6-flash",
        temperature: 0,
        apiKey: process.env.GEMINI_API_KEY
    });

    const tools = []; // Add recovery-specific tools here

    return createReactAgent({
        llm,
        tools,
        stateModifier: systemPrompt
    });
};

module.exports = { createRecoveryAgent };
