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

const searchExercisesSchema = z.object({
    query: z.string().optional().describe("Search term for the exercise name."),
    muscleGroup: z.string().optional().describe("Filter by muscle group (e.g., chest, back, legs, core).")
});

const createExerciseSchema = z.object({
    name: z.string().describe("The name of the new exercise."),
    muscleGroup: z.string().describe("The primary muscle group targeted."),
    description: z.string().optional().describe("Instructions on how to perform the exercise."),
    caloriesPerMinute: z.number().describe("Estimated calories burned per minute.")
});

const createWeeklyPlanSchema = z.object({
    planName: z.string().describe("Name of the weekly plan."),
    description: z.string().optional().describe("Description of the plan."),
    isActive: z.boolean().optional().default(true).describe("Whether to immediately activate this plan."),
    days: z.array(z.object({
        day: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
        exercises: z.array(z.object({
            exercise: z.string().describe("The ObjectId of the exercise. ALWAYS use searchExercisesTool to find the ID first. If not found, use createExerciseTool."),
            duration: z.number().optional().describe("Duration in minutes (e.g., for cardio)."),
            sets: z.number().optional().describe("Number of sets."),
            reps: z.number().optional().describe("Number of reps per set.")
        }))
    }))
});

const getWeeklyPlansSchema = z.object({});

module.exports = {
    getTodayWorkoutSchema,
    getWorkoutHistorySchema,
    adaptWorkoutSchema,
    searchExercisesSchema,
    createExerciseSchema,
    createWeeklyPlanSchema,
    getWeeklyPlansSchema
};
