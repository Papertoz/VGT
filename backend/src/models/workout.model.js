const mongoose = require("mongoose");

const completedExerciseSchema = new mongoose.Schema({
    exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exercise",
        required: true
    },

    exerciseOrder: {
        type: Number,
        required: true
    },

    plannedDuration: {
        type: Number,
        required: true
    },

    completedDuration: {
        type: Number,
        default: 0
    },

    plannedSets: {
        type: Number,
        required: true
    },

    completedSets: {
        type: Number,
        default: 0
    },

    plannedReps: {
        type: Number,
        required: true
    },

    completedReps: {
        type: Number,
        default: 0
    },

    caloriesBurned: {
        type: Number,
        default: 0
    },

    completed: {
        type: Boolean,
        default: false
    },

    skipped: {
        type: Boolean,
        default: false
    }

}, { _id: false });

const workoutSessionSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    weeklyPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WeeklyPlan",
        required: true
    },

    workoutDay: {
        type: String,
        enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday"
        ],
        required: true
    },

    status: {
        type: String,
        enum: [
            "started",
            "paused",
            "completed",
            "cancelled"
        ],
        default: "started"
    },

    date: {
        type: Date,
        default: Date.now
    },

    startTime: {
        type: Date,
        default: Date.now
    },

    endTime: {
        type: Date
    },

    exercises: [completedExerciseSchema],

    totalCaloriesBurned: {
        type: Number,
        default: 0
    },

    totalDuration: {
        type: Number,
        default: 0
    },

    completionPercentage: {
        type: Number,
        default: 0
    },

    notes: {
        type: String,
        trim: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("WorkoutSession", workoutSessionSchema);