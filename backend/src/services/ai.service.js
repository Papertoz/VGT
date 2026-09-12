const User = require("../models/user.model");
const WorkoutSession = require("../models/workout.model");
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
        require('fs').writeFileSync('ai_error.log', String(error) + '\\n' + error.stack);
        throw new Error("Failed to generate AI response: " + error.message);
    }
};

const getRecentWorkoutLogs = async (userId, limit = 5) => {
    const workouts = await WorkoutSession.find({ user: userId, status: "completed" })
        .sort({ date: -1 })
        .limit(limit)
        .populate("exercises.exercise", "name");
    
    if (!workouts || workouts.length === 0) {
        return "I do not have any recent completed workout logs.";
    }

    let logs = "Here are my recent workout logs:\n";
    workouts.forEach((w, index) => {
        const dateStr = w.date ? w.date.toISOString().split('T')[0] : 'Unknown date';
        logs += `\nWorkout ${index + 1} (${dateStr}):\n`;
        logs += `- Duration: ${w.totalDuration || 0} mins, Calories Burned: ${w.totalCaloriesBurned || 0}\n`;
        if (w.exercises && w.exercises.length > 0) {
            logs += `- Exercises:\n`;
            w.exercises.forEach(ex => {
                const exName = ex.exercise && ex.exercise.name ? ex.exercise.name : "Unknown Exercise";
                logs += `  * ${exName}: ${ex.completedSets || 0} sets, ${ex.completedReps || 0} reps\n`;
            });
        }
    });
    return logs;
};

const generateProgressReport = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");
        
        const logs = await getRecentWorkoutLogs(userId, 10);
        const prompt = `Please generate my latest progress report based on my workout history. ${logs}`;

        const agent = createProgressAgent(getUserPreferences(user));
        const result = await agent.invoke({ messages: [new HumanMessage(prompt)] });
        return result.messages[result.messages.length - 1].content;
    } catch (error) {
        require('fs').writeFileSync('ai_error.log', String(error) + '\\n' + error.stack);
        throw new Error("Failed to generate progress report: " + error.message);
    }
};

const getRecoverySuggestions = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");
        
        const logs = await getRecentWorkoutLogs(userId, 3);
        const prompt = `What should I do for recovery today based on my recent activity? ${logs}`;

        const agent = createRecoveryAgent(getUserPreferences(user));
        const result = await agent.invoke({ messages: [new HumanMessage(prompt)] });
        return result.messages[result.messages.length - 1].content;
    } catch (error) {
        require('fs').writeFileSync('ai_error.log', String(error) + '\\n' + error.stack);
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
