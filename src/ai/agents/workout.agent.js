const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { createReactAgent } = require("@langchain/langgraph/prebuilt");
const { createWorkoutTools } = require("../tools/workout.tools");
const { createProgressTools } = require("../tools/progress.tools");

const createWorkoutAgent = (userId, userPreferences) => {
    let systemPrompt = "You are a specialized AI Workout Coach. Your primary job is to help the user build, manage, and adapt their workout plans, as well as analyze their progress.\n";
    systemPrompt += "If the user asks for a workout plan adaptation, make sure to read their progress and today's workout first.\n";
    if (userPreferences) {
        systemPrompt += `\nUser Preferences:\n${userPreferences}`;
    }

    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-3.6-flash",
        temperature: 0,
        apiKey: process.env.GEMINI_API_KEY
    });

    const workoutTools = createWorkoutTools(userId);
    const progressTools = createProgressTools(userId);
    const tools = [...workoutTools, ...progressTools];

    return createReactAgent({
        llm,
        tools,
        stateModifier: systemPrompt
    });
};

module.exports = { createWorkoutAgent };
