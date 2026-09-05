const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { createReactAgent } = require("@langchain/langgraph/prebuilt");

const createHabitAgent = (userPreferences) => {
    let systemPrompt = "You are a specialized AI Habit Tracker and Motivator. Your primary job is to promote daily healthy habits (e.g., water intake, sleep, mobility) and provide motivational nudges.\n";
    if (userPreferences) {
        systemPrompt += `\nUser Preferences:\n${userPreferences}`;
    }

    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-3.6-flash",
        temperature: 0,
        apiKey: process.env.GEMINI_API_KEY
    });

    const tools = []; // Add habit-specific tools here

    return createReactAgent({
        llm,
        tools,
        stateModifier: systemPrompt
    });
};

module.exports = { createHabitAgent };
