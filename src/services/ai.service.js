const User = require("../models/user.model");
const { createSupervisorGraph } = require("../ai/workflows/graph");
const { HumanMessage } = require("@langchain/core/messages");

const generateChatResponse = async (userId, userMessage) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        let userPreferences = "";
        if (user.aiPreferences) {
            if (user.aiPreferences.fitnessGoal) userPreferences += `- Goal: ${user.aiPreferences.fitnessGoal}\n`;
            if (user.aiPreferences.injuries && user.aiPreferences.injuries.length) userPreferences += `- Injuries/Limitations: ${user.aiPreferences.injuries.join(", ")}\n`;
            if (user.aiPreferences.equipmentAvailable && user.aiPreferences.equipmentAvailable.length) userPreferences += `- Available Equipment: ${user.aiPreferences.equipmentAvailable.join(", ")}\n`;
        }

        // 1. Create the compiled LangGraph workflow
        const graph = createSupervisorGraph(userId, userPreferences);

        // 2. Execute the graph
        const result = await graph.invoke({
            messages: [new HumanMessage(userMessage)]
        });

        // 3. Get the final message output
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
