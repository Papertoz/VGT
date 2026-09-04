const { ChatGoogleGenAI } = require("@langchain/google-genai");
const { createToolCallingAgent, AgentExecutor } = require("langchain/agents");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
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

        const llm = new ChatGoogleGenAI({
            modelName: "gemini-1.5-flash",
            temperature: 0,
            apiKey: process.env.GEMINI_API_KEY
        });

        // 1. Create the tools (injecting the userId so the LLM doesn't have to provide it)
        const tools = createWorkoutTools(userId);

        // 2. Create the prompt
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", systemPrompt],
            ["user", "{input}"],
            new MessagesPlaceholder("agent_scratchpad"),
        ]);

        // 3. Create the agent
        const agent = createToolCallingAgent({
            llm,
            tools,
            prompt,
        });

        // 4. Create the executor
        const agentExecutor = new AgentExecutor({
            agent,
            tools,
            verbose: true,
        });

        // 5. Execute
        const result = await agentExecutor.invoke({
            input: userMessage
        });

        return result.output;
    } catch (error) {
        console.error("OpenAI Error:", error);
        throw new Error("Failed to generate AI response: " + error.message);
    }
};

module.exports = {
    generateChatResponse
};
