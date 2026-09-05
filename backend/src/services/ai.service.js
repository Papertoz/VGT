const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { createReactAgent } = require("@langchain/langgraph/prebuilt");
const { createWorkoutTools } = require("../ai/tools/workout.tools");
const User = require("../models/user.model");

const generateChatResponse = async (userId, userMessage) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        let systemPrompt = "You are an AI-powered autonomous adaptive fitness coach. You have tools to read the user's workout data. Use them to answer questions accurately.\n";
         
        if (user.aiPreferences) {
            systemPrompt += `\nUser Preferences:\n`;
            if (user.aiPreferences.fitnessGoal) systemPrompt += `- Goal: ${user.aiPreferences.fitnessGoal}\n`;
            if (user.aiPreferences.injuries && user.aiPreferences.injuries.length) systemPrompt += `- Injuries/Limitations: ${user.aiPreferences.injuries.join(", ")}\n`;
            if (user.aiPreferences.equipmentAvailable && user.aiPreferences.equipmentAvailable.length) systemPrompt += `- Available Equipment: ${user.aiPreferences.equipmentAvailable.join(", ")}\n`;
        }
 
        const llm = new ChatGoogleGenerativeAI({
            model: "gemini-3.6-flash",
            temperature: 0,
            apiKey: process.env.GEMINI_API_KEY
        });

        // 1. Create the tools (injecting the userId so the LLM doesn't have to provide it)
        const tools = createWorkoutTools(userId);
      
        // 2. Create the agent
        const agent = createReactAgent({
            llm,
            tools,
            stateModifier: systemPrompt
        });

        // 3. Execute
        const result = await agent.invoke({
            messages: [
                ["user", userMessage]
            ]
        });

        const outputMsg = result.messages[result.messages.length - 1];
        return outputMsg.content;
    } catch (error) {
        console.error("OpenAI Error:", error);
        throw new Error("Failed to generate AI response: " + error.message);
    }
};

module.exports = {
    generateChatResponse
};
