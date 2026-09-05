const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { createReactAgent } = require("@langchain/langgraph/prebuilt");

const createGoalAgent = (userPreferences) => {
    let systemPrompt = "You are a specialized AI Goal Setter. Your primary job is to help users set realistic SMART fitness goals, break them down into milestones, and track achievements over time.\n";
    if (userPreferences) {
        systemPrompt += `\nUser Preferences:\n${userPreferences}`;
    }

    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-3.6-flash",
        temperature: 0,
        apiKey: process.env.GEMINI_API_KEY
    });

    const tools = []; // Add goal-specific tools here

    return createReactAgent({
        llm,
        tools,
        stateModifier: systemPrompt
    });
};

module.exports = { createGoalAgent };
