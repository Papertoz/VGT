const { tool } = require("@langchain/core/tools");
const { getTodayWorkoutSchema, getWorkoutHistorySchema, adaptWorkoutSchema } = require("../schemas/workout.tools.schema");
const weeklyPlanService = require("../../services/weeklyPlan.service");
const workoutService = require("../../services/workout.service");

// Note: userId will be bound to the tools when the agent is invoked, 
// so the LLM doesn't have to provide it. This is a crucial security step.

const createWorkoutTools = (userId) => {
    
    const getTodayWorkoutTool = tool(
        async () => {
            try {
                const result = await weeklyPlanService.getTodayWorkout(userId);
                return JSON.stringify(result);
            } catch (error) {
                return `Error: ${error.message}`;
            }
        },
        {
            name: "getTodayWorkout",
            description: "Retrieves the user's workout for the current day. Call this to see what exercises the user needs to do today.",
            schema: getTodayWorkoutSchema
        }
    );

    const getWorkoutHistoryTool = tool(
        async ({ limit }) => {
            try {
                const history = await workoutService.getWorkoutHistory(userId);
                // Return only the requested number of items
                const limitedHistory = history.slice(0, limit);
                return JSON.stringify(limitedHistory);
            } catch (error) {
                return `Error: ${error.message}`;
            }
        },
        {
            name: "getWorkoutHistory",
            description: "Retrieves the user's past completed workouts.",
            schema: getWorkoutHistorySchema
        }
    );

    const adaptWorkoutTool = tool(
        async ({ reason, modifications }) => {
            try {
                const result = await weeklyPlanService.adaptWeeklyPlanToday(userId, reason, modifications);
                return JSON.stringify(result);
            } catch (error) {
                return `Error: ${error.message}`;
            }
        },
        {
            name: "adaptWorkout",
            description: "Modifies the user's workout for the current day. Call this when the user needs to adapt their workout (e.g. less time, skipped an exercise, too tired).",
            schema: adaptWorkoutSchema
        }
    );

    return [getTodayWorkoutTool, getWorkoutHistoryTool, adaptWorkoutTool];
};

module.exports = {
    createWorkoutTools
};
