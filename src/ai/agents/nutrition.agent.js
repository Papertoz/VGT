const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { createReactAgent } = require("@langchain/langgraph/prebuilt");

const createNutritionAgent = (userPreferences) => {
    let systemPrompt = "You are a specialized AI Nutrition Coach. Your primary job is to provide dietary advice based on the user's fitness goals.\n";
    if (userPreferences) {
        systemPrompt += `\nUser Preferences:\n${userPreferences}`;
    }

    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-3.6-flash",
        temperature: 0,
        apiKey: process.env.GEMINI_API_KEY
    });

    const tools = [];

    return createReactAgent({
        llm,
        tools,
        stateModifier: systemPrompt
    });
};

module.exports = { createNutritionAgent };
