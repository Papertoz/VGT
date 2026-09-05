const WorkoutSession = require("../models/workout.model");
const Progress = require("../models/progress.model");

const getWeeklyProgressSummary = async (userId) => {
    // 1. Get Workout Sessions from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSessions = await WorkoutSession.find({
        user: userId,
        createdAt: { $gte: sevenDaysAgo }
    }).populate("exercises.exercise");

    let totalSessions = recentSessions.length;
    let completedSessions = 0;
    let skippedExercisesMap = {};

    recentSessions.forEach(session => {
        if (session.status === "completed") {
            completedSessions++;
        }
        
        session.exercises.forEach(ex => {
            if (ex.skipped) {
                const exName = ex.exercise?.name || "Unknown Exercise";
                skippedExercisesMap[exName] = (skippedExercisesMap[exName] || 0) + 1;
            }
        });
    });

    const workoutConsistency = totalSessions > 0 
        ? Math.round((completedSessions / totalSessions) * 100) + "%" 
        : "No workouts recorded in the last 7 days.";

    // Sort skipped exercises by frequency
    const skippedExercises = Object.keys(skippedExercisesMap).sort(
        (a, b) => skippedExercisesMap[b] - skippedExercisesMap[a]
    );

    // 2. Get Progress (Weight) changes
    const progressRecords = await Progress.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(2);

    let weightChange = "Not enough data";
    if (progressRecords.length >= 2) {
        const latest = progressRecords[0].weight;
        const previous = progressRecords[1].weight;
        if (latest && previous) {
            const diff = latest - previous;
            weightChange = diff > 0 ? `+${diff}kg` : `${diff}kg`;
        }
    }

    return {
        workoutConsistency,
        weightChange,
        skippedExercises,
        completedSessionsThisWeek: completedSessions
    };
};

module.exports = {
    getWeeklyProgressSummary
};
