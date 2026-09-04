const WorkoutSession = require("../models/workout.model");
const WeeklyPlan = require("../models/weeklyPlan.model");
const Exercise = require("../models/exercise.model");

const startWorkout = async (userId) => {
    // 1. Check if user already has an active workout
    const existingWorkout = await WorkoutSession.findOne({
        user: userId,
        status: { $in: ["started", "paused"] }
    });

    if (existingWorkout) {
        throw new Error("You already have an active workout.");
    }

    // 2. Find user's ACTIVE weekly plan
    const weeklyPlan = await WeeklyPlan.findOne({
        user: userId,
        isActive: true
    });

    if (!weeklyPlan) {
        throw new Error("No active weekly plan found.");
    }

    // 3. Get today's day
    const today = new Date()
        .toLocaleString("en-US", {
            weekday: "long"
        })
        .toLowerCase();

    // 4. Find today's workout
    const todayWorkout = weeklyPlan.days.find(
        day => day.day.toLowerCase() === today
    );

    if (!todayWorkout) {
        throw new Error(`No workout scheduled for ${today}.`);
    }

    // 5. Make sure today has exercises
    if (
        !todayWorkout.exercises ||
        todayWorkout.exercises.length === 0
    ) {
        throw new Error(`No exercises scheduled for ${today}.`);
    }

    // 6. Prepare exercises for WorkoutSession
    const workoutExercises = todayWorkout.exercises.map(
        (exercise, index) => ({
            exercise: exercise.exercise,
            exerciseOrder: index + 1,
            plannedDuration: exercise.duration || 0,
            completedDuration: 0,
            plannedSets: exercise.sets || 0,
            completedSets: 0,
            plannedReps: exercise.reps || 0,
            completedReps: 0,
            caloriesBurned: 0,
            completed: false,
            skipped: false
        })
    );

    // 7. Create WorkoutSession
    const workoutSession = await WorkoutSession.create({
        user: userId,
        weeklyPlan: weeklyPlan._id,
        workoutDay: today,
        status: "started",
        startTime: new Date(),
        exercises: workoutExercises
    });

    // 8. Populate data for response
    const session = await WorkoutSession.findById(
        workoutSession._id
    )
        .populate("weeklyPlan")
        .populate("exercises.exercise");

    return session;
};

const getCurrentWorkout = async (userId) => {
    const workoutSession = await WorkoutSession.findOne({
        user: userId,
        status: { $in: ["started", "paused"] }
    })
        .populate("weeklyPlan")
        .populate("exercises.exercise");

    if (!workoutSession) {
        throw new Error("No active workout found.");
    }

    // Calculate workout progress
    const totalExercises = workoutSession.exercises.length;
    const completedExercises = workoutSession.exercises.filter(
        exercise => exercise.completed
    ).length;
    const skippedExercises = workoutSession.exercises.filter(
        exercise => exercise.skipped
    ).length;
    const remainingExercises = totalExercises - completedExercises - skippedExercises;

    return {
        workout: workoutSession,
        progress: {
            totalExercises,
            completedExercises,
            skippedExercises,
            remainingExercises,
            completionPercentage: workoutSession.completionPercentage
        }
    };
};

const completeExercise = async (userId, workoutId, exerciseId, data) => {
    const {
        completedSets,
        completedReps,
        completedDuration,
    } = data;

    // Find workout
    const workoutSession = await WorkoutSession.findOne({
        _id: workoutId,
        user: userId,
        status: { $in: ["started", "paused"] }
    });

    if (!workoutSession) {
        throw new Error("Workout session not found.");
    }

    // Find exercise inside workout
    const exercise = workoutSession.exercises.find(
        ex => (ex.exercise?._id ? ex.exercise._id.toString() : ex.exercise?.toString()) === exerciseId 
        || ex._id?.toString() === exerciseId
    );

    if (!exercise) {
        throw new Error("Exercise not found.");
    }

    // Update exercise
    exercise.completed = true;
    exercise.skipped = false;
    const exerciseData = await Exercise.findById(exerciseId);
    exercise.completedSets = completedSets;
    exercise.completedReps = completedReps;
    exercise.completedDuration = completedDuration;
    exercise.caloriesBurned = exerciseData.caloriesPerMinute * (completedDuration || 0);

    // Recalculate totals
    let totalCalories = 0; 
    let totalDuration = 0;
    let completedCount = 0;

    workoutSession.exercises.forEach(ex => {
        totalCalories += ex.caloriesBurned;
        totalDuration += ex.completedDuration;
        if (ex.completed) {
            completedCount++;
        }
    });

    workoutSession.totalCaloriesBurned = totalCalories;
    workoutSession.totalDuration = totalDuration;
    workoutSession.completionPercentage = (completedCount / workoutSession.exercises.length) * 100;

    await workoutSession.save();

    const updatedWorkout = await WorkoutSession.findById(workoutId)
        .populate("exercises.exercise");

    return updatedWorkout;
};

const skipExercise = async (userId, workoutId, exerciseId) => {
    const workoutSession = await WorkoutSession.findOne({
        _id: workoutId,
        user: userId,
        status: { $in: ["started", "paused"] }
    });

    if(!workoutSession){
        throw new Error("Workout session not found.");
    }

    const exercise = workoutSession.exercises.find(
        ex => ex.exercise.toString() === exerciseId
    );

    if(!exercise){
        throw new Error("Exercise not found.");
    }

    exercise.skipped = true;
    exercise.completed = false;

    await workoutSession.save();

    const updatedWorkout = await WorkoutSession.findById(workoutId)
        .populate("exercises.exercise");

    return updatedWorkout;
};

const pauseWorkout = async (userId, workoutId) => {
    const workoutSession = await WorkoutSession.findOne({
        _id: workoutId,
        user: userId,
        status: "started"
    });

    if(!workoutSession){
        throw new Error("Workout session not found.");
    }

    workoutSession.status = "paused";
    await workoutSession.save();

    return workoutSession;
};

const resumeWorkout = async (userId, workoutId) => {
    const workoutSession = await WorkoutSession.findOne({
        _id: workoutId,
        user: userId,
        status: "paused"
    });

    if(!workoutSession){
        throw new Error("Workout session not found.");
    }

    workoutSession.status = "started";
    await workoutSession.save();

    return workoutSession;
};

const finishWorkout = async (userId, workoutId) => {
    const workoutSession = await WorkoutSession.findOne({
        _id: workoutId,
        user: userId,
        status: { $in: ["started", "paused"] }
    });

    if(!workoutSession){
        throw new Error("Workout session not found.");
    }

    workoutSession.status = "completed";
    workoutSession.endTime = new Date();
    await workoutSession.save();

    return workoutSession;
};

const getWorkoutHistory = async (userId) => {
    const workoutHistory = await WorkoutSession.find({
        user: userId,
        status: "completed"
    })
    .populate("weeklyPlan")
    .sort({ date: -1 });

    return workoutHistory;
};

module.exports = {
    startWorkout,
    getCurrentWorkout,
    completeExercise,
    skipExercise,
    pauseWorkout,
    resumeWorkout,
    finishWorkout,
    getWorkoutHistory
};
