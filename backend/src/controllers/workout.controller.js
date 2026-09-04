const WorkoutSession = require("../models/workout.model");
const WeeklyPlan = require("../models/weeklyPlan.model");
const Exercise = require("../models/exercise.model");

const startWorkout = async (req, res) => {
    try {

        // Logged in user
        const user = req.user.id;

        // 1. Check if user already has an active workout
        const existingWorkout = await WorkoutSession.findOne({
            user,
            status: { $in: ["started", "paused"] }
        });

        if (existingWorkout) {
            return res.status(400).json({
                success: false,
                message: "You already have an active workout."
            });
        }

        // 2. Find user's ACTIVE weekly plan
        const weeklyPlan = await WeeklyPlan.findOne({
            user,
            isActive: true
        });

        if (!weeklyPlan) {
            return res.status(404).json({
                success: false,
                message: "No active weekly plan found."
            });
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
            return res.status(404).json({
                success: false,
                message: `No workout scheduled for ${today}.`
            });
        }

        // 5. Make sure today has exercises
        if (
            !todayWorkout.exercises ||
            todayWorkout.exercises.length === 0
        ) {
            return res.status(404).json({
                success: false,
                message: `No exercises scheduled for ${today}.`
            });
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
            user,

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

        // 9. Send response
        res.status(201).json({
            success: true,
            message: "Workout started successfully.",
            workout: session
        });

    } catch (err) {

        console.error("Start Workout Error:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const getCurrentWorkout = async (req, res) => {
    try {

        const user = req.user.id;

        const workoutSession = await WorkoutSession.findOne({
            user,
            status: { $in: ["started", "paused"] }
        })
            .populate("weeklyPlan")
            .populate("exercises.exercise");

        if (!workoutSession) {
            return res.status(404).json({
                success: false,
                message: "No active workout found."
            });
        }

        // Calculate workout progress
        const totalExercises = workoutSession.exercises.length;

        const completedExercises = workoutSession.exercises.filter(
            exercise => exercise.completed
        ).length;

        const skippedExercises = workoutSession.exercises.filter(
            exercise => exercise.skipped
        ).length;

        const remainingExercises =
            totalExercises - completedExercises - skippedExercises;

        res.status(200).json({
            success: true,
            workout: workoutSession,
            progress: {
                totalExercises,
                completedExercises,
                skippedExercises,
                remainingExercises,
                completionPercentage:
                    workoutSession.completionPercentage
            }
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

const completeExercise = async (req, res) => {
    try {

        const user = req.user.id;
        const { workoutId, exerciseId } = req.params;

        const {
            completedSets,
            completedReps,
            completedDuration,
        } = req.body;

        // Find workout
        const workoutSession = await WorkoutSession.findOne({
            _id: workoutId,
            user,
            status: { $in: ["started", "paused"] }
        });

        if (!workoutSession) {
            return res.status(404).json({
                success: false,
                message: "Workout session not found."
            });
        }
        console.log("Looking for exerciseId:", exerciseId);
        console.log("Available in session:", workoutSession.exercises.map(e => ({
            subdocumentId: e._id?.toString(),
            exerciseRefId: e.exercise?._id ? e.exercise._id.toString() : e.exercise?.toString()
        })));
        // Find exercise inside workout
        const exercise = workoutSession.exercises.find(
            ex => (ex.exercise?._id ? ex.exercise._id.toString() : ex.exercise?.toString()) === exerciseId
                || ex._id?.toString() === exerciseId
        );

        if (!exercise) {
            return res.status(404).json({
                success: false,
                message: "Exercise not found."
            });
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

        workoutSession.completionPercentage =
            (completedCount / workoutSession.exercises.length) * 100;

        await workoutSession.save();

        const updatedWorkout = await WorkoutSession.findById(workoutId)
            .populate("exercises.exercise");

        res.status(200).json({
            success: true,
            message: "Exercise completed successfully.",
            workout: updatedWorkout
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

const skipExercise = async (req, res) => {
    try {
        const user = req.user.id;
        const { workoutId, exerciseId } = req.params;

        const workoutSession = await WorkoutSession.findOne({
            _id: workoutId,
            user,
            status: { $in: ["started", "paused"] }
        });

        if (!workoutSession) {
            return res.status(404).json({
                success: false,
                message: "Workout session not found."
            });
        }

        const exercise = workoutSession.exercises.find(
            ex => ex.exercise.toString() === exerciseId
        );

        if (!exercise) {
            return res.status(404).json({
                success: false,
                message: "Exercise not found."
            }); 
        }

        exercise.skipped = true;
        exercise.completed = false;

        await workoutSession.save();

        const updatedWorkout = await WorkoutSession.findById(workoutId)
            .populate("exercises.exercise");

        res.status(200).json({
            success: true,
            message: "Exercise skipped successfully.",
            workout: updatedWorkout
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const pauseWorkout = async (req, res) => {
    try {
        const user = req.user.id;
        const { workoutId } = req.params;

        const workoutSession = await WorkoutSession.findOne({
            _id: workoutId,
            user,
            status: "started"
        });

        if (!workoutSession) {
            return res.status(404).json({
                success: false,
                message: "Workout session not found."
            });
        }

        workoutSession.status = "paused";
        await workoutSession.save();

        res.status(200).json({
            success: true,
            message: "Workout paused successfully.",
            workout: workoutSession
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const resumeWorkout = async (req, res) => {
    try {
        const user = req.user.id;
        const { workoutId } = req.params;

        const workoutSession = await WorkoutSession.findOne({
            _id: workoutId,
            user,
            status: "paused"
        });

        if (!workoutSession) {
            return res.status(404).json({
                success: false,
                message: "Workout session not found."
            });
        }

        workoutSession.status = "started";
        await workoutSession.save();

        res.status(200).json({
            success: true,
            message: "Workout resumed successfully.",
            workout: workoutSession
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const finishWorkout = async (req, res) => {
    try {
        const user = req.user.id;
        const { workoutId } = req.params;

        const workoutSession = await WorkoutSession.findOne({
            _id: workoutId,
            user,
            status: { $in: ["started", "paused"] }
        });

        if (!workoutSession) {
            return res.status(404).json({
                success: false,
                message: "Workout session not found."
            });
        }

        workoutSession.status = "completed";
        workoutSession.endTime = new Date();
        await workoutSession.save();

        res.status(200).json({
            success: true,
            message: "Workout completed successfully.",
            workout: workoutSession
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const getWorkoutHistory = async (req, res) => {
    try {
        const user = req.user.id;

        const workoutHistory = await WorkoutSession.find({
            user,
            status: "completed"
        })
            .populate("weeklyPlan")
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            message: "Workout history retrieved successfully.",
            history: workoutHistory
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
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