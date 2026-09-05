const { tool } = require("@langchain/core/tools");
const { 
    getTodayWorkoutSchema, 
    getWorkoutHistorySchema, 
    adaptWorkoutSchema,
    searchExercisesSchema,
    createExerciseSchema,
    createWeeklyPlanSchema,
    getWeeklyPlansSchema
} = require("../schemas/workout.tools.schema");
const Exercise = require("../../models/exercise.model");
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

    const searchExercisesTool = tool(
        async ({ query, muscleGroup }) => {
            try {
                let filter = {};
                if (query) filter.name = { $regex: query, $options: "i" };
                if (muscleGroup) filter.muscleGroup = { $regex: muscleGroup, $options: "i" };
                
                const exercises = await Exercise.find(filter).limit(20);
                return JSON.stringify(exercises.map(e => ({ id: e._id, name: e.name, muscleGroup: e.muscleGroup, caloriesPerMinute: e.caloriesPerMinute })));
            } catch (error) {
                return `Error: ${error.message}`;
            }
        },
        {
            name: "searchExercises",
            description: "Search for exercises in the database by name or muscle group to get their ObjectIds.",
            schema: searchExercisesSchema
        }
    );

    const createExerciseTool = tool(
        async ({ name, muscleGroup, description, caloriesPerMinute }) => {
            try {
                const exercise = await Exercise.create({ name, muscleGroup, description, caloriesPerMinute });
                return JSON.stringify({ success: true, id: exercise._id, name: exercise.name });
            } catch (error) {
                return `Error: ${error.message}`;
            }
        },
        {
            name: "createExercise",
            description: "Create a new exercise in the database if it doesn't already exist.",
            schema: createExerciseSchema
        }
    );

    const createWeeklyPlanTool = tool(
        async (planData) => {
            try {
                const result = await weeklyPlanService.createPlan(userId, planData);
                return JSON.stringify({ success: true, planId: result._id, planName: result.planName });
            } catch (error) {
                return `Error: ${error.message}`;
            }
        },
        {
            name: "createWeeklyPlan",
            description: "Create and save a new weekly workout plan for the user.",
            schema: createWeeklyPlanSchema
        }
    );

    const getWeeklyPlansTool = tool(
        async () => {
            try {
                const plans = await weeklyPlanService.getPlans(userId);
                return JSON.stringify(plans.map(p => ({ id: p._id, name: p.planName, isActive: p.isActive, description: p.description })));
            } catch (error) {
                return `Error: ${error.message}`;
            }
        },
        {
            name: "getWeeklyPlans",
            description: "Retrieve all weekly plans saved for the user.",
            schema: getWeeklyPlansSchema
        }
    );

    return [
        getTodayWorkoutTool, 
        getWorkoutHistoryTool, 
        adaptWorkoutTool,
        searchExercisesTool,
        createExerciseTool,
        createWeeklyPlanTool,
        getWeeklyPlansTool
    ];
};

module.exports = {
    createWorkoutTools
};
