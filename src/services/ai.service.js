const User = require("../models/user.model");
const { createSupervisorGraph } = require("../ai/workflows/graph");
const { HumanMessage } = require("@langchain/core/messages");

// Import standalone agents for direct invocation
const { createProgressAgent } = require("../ai/agents/progress.agent");
const { createRecoveryAgent } = require("../ai/agents/recovery.agent");
const { createGoalAgent } = require("../ai/agents/goal.agent");
const { createSafetyAgent } = require("../ai/agents/safety.agent");

const getUserPreferences = (user) => {
    let userPreferences = "";
    if (user.aiPreferences) {
        if (user.aiPreferences.fitnessGoal) userPreferences += `- Goal: ${user.aiPreferences.fitnessGoal}\n`;
        if (user.aiPreferences.injuries && user.aiPreferences.injuries.length) userPreferences += `- Injuries/Limitations: ${user.aiPreferences.injuries.join(", ")}\n`;
        if (user.aiPreferences.equipmentAvailable && user.aiPreferences.equipmentAvailable.length) userPreferences += `- Available Equipment: ${user.aiPreferences.equipmentAvailable.join(", ")}\n`;
    }
    return userPreferences;
};

const generateChatResponse = async (userId, userMessage) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const userPreferences = getUserPreferences(user);
        const graph = createSupervisorGraph(userId, userPreferences);

        const result = await graph.invoke({
            messages: [new HumanMessage(userMessage)]
        });

        const outputMsg = result.messages[result.messages.length - 1];
        return outputMsg.content;
    } catch (error) {
        console.error("OpenAI Error:", error);
        throw new Error("Failed to generate AI response: " + error.message);
    }
};

const generateProgressReport = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");
        
        const agent = createProgressAgent(getUserPreferences(user));
        const result = await agent.invoke({ messages: [new HumanMessage("Please generate my latest progress report based on my workout history.")] });
        return result.messages[result.messages.length - 1].content;
    } catch (error) {
        throw new Error("Failed to generate progress report: " + error.message);
    }
};

const getRecoverySuggestions = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");
        
        const agent = createRecoveryAgent(getUserPreferences(user));
        const result = await agent.invoke({ messages: [new HumanMessage("What should I do for recovery today based on my recent activity?")] });
        return result.messages[result.messages.length - 1].content;
    } catch (error) {
        throw new Error("Failed to get recovery suggestions: " + error.message);
    }
};

const evaluateGoal = async (userId, goalMessage) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");
        
        const agent = createGoalAgent(getUserPreferences(user));
        const result = await agent.invoke({ messages: [new HumanMessage(`Please evaluate this fitness goal and provide a SMART breakdown: ${goalMessage}`)] });
        return result.messages[result.messages.length - 1].content;
    } catch (error) {
        throw new Error("Failed to evaluate goal: " + error.message);
    }
};

const checkSafety = async (userId, activityMessage) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");
        
        const agent = createSafetyAgent(getUserPreferences(user));
        const result = await agent.invoke({ messages: [new HumanMessage(`Please evaluate the safety of the following plan: ${activityMessage}`)] });
        return result.messages[result.messages.length - 1].content;
    } catch (error) {
        throw new Error("Failed to check safety: " + error.message);
    }
};

module.exports = {
    generateChatResponse,
    generateProgressReport,
    getRecoverySuggestions,
    evaluateGoal,
    checkSafety
};
