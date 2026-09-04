const { z } = require("zod");

// The user ID is always injected by the backend, so the AI never provides it.

const getTodayWorkoutSchema = z.object({});

const getWorkoutHistorySchema = z.object({
    limit: z.number().optional().default(5).describe("The number of past workouts to retrieve.")
});

const adaptWorkoutSchema = z.object({
    reason: z.string().describe("Explanation for the user regarding why the workout was changed."),
    modifications: z.array(z.object({
        exerciseId: z.string().describe("The ID of the exercise in the weekly plan to modify."),
        action: z.enum(["remove", "update"]).describe("Whether to remove the exercise or update its sets/duration."),
        newSets: z.number().optional().describe("The new number of sets if updating."),
        newDuration: z.number().optional().describe("The new duration (in minutes) if updating.")
    }))
});

module.exports = {
    getTodayWorkoutSchema,
    getWorkoutHistorySchema,
    adaptWorkoutSchema
};
