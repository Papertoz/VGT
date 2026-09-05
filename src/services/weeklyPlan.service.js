const WeeklyPlan = require("../models/weeklyPlan.model");

const createPlan = async (userId, planData) => {
    const { planName, description, days, isActive } = planData;

    if (isActive) {
        await WeeklyPlan.updateMany({ user: userId }, { isActive: false });
    }

    const existingPlansCount = await WeeklyPlan.countDocuments({ user: userId });
    const isFirstPlan = existingPlansCount === 0;

    const plan = await WeeklyPlan.create({
        planName,
        description,
        user: userId,
        days,
        isActive: isFirstPlan ? true : (isActive || false)
    });

    return plan;
};

const getPlans = async (userId) => {
    return await WeeklyPlan.find({ user: userId }).sort({ createdAt: -1 });
};

const getPlanById = async (userId, planId) => {
    return await WeeklyPlan.findOne({ _id: planId, user: userId });
};

const updatePlan = async (userId, planId, planData) => {
    const { planName, description, days, isActive } = planData;
    
    const planToUpdate = await WeeklyPlan.findOne({ _id: planId, user: userId });
    if (!planToUpdate) {
        throw new Error("Plan not found");
    }

    if (isActive === true) {
        await WeeklyPlan.updateMany(
            { user: userId, _id: { $ne: planToUpdate._id } },
            { isActive: false }
        );
    }

    const updatedPlan = await WeeklyPlan.findByIdAndUpdate(
        planId,
        { planName, description, days, isActive },
        { new: true, runValidators: true }
    );

    return updatedPlan;
};

const activatePlan = async (userId, planId) => {
    const plan = await WeeklyPlan.findOne({ _id: planId, user: userId });
    if (!plan) {
        throw new Error("Plan not found");
    }

    await WeeklyPlan.updateMany({ user: userId }, { isActive: false });
    plan.isActive = true;
    await plan.save();

    return plan;
};

const deletePlan = async (userId, planId) => {
    const plan = await WeeklyPlan.findOneAndDelete({ _id: planId, user: userId });
    
    if (!plan) {
        throw new Error("Plan not found");
    }

    if (plan.isActive) {
        const nextPlan = await WeeklyPlan.findOne({ user: userId }).sort({ createdAt: -1 });
        if (nextPlan) {
            nextPlan.isActive = true;
            await nextPlan.save();
        }
    }

    return plan;
};

const getTodayWorkout = async (userId) => {
    const weeklyPlan = await WeeklyPlan.findOne({
        user: userId,
        isActive: true
    }).populate("days.exercises.exercise");

    if (!weeklyPlan) {
        throw new Error("Active weekly plan not found");
    }

    const today = new Date()
        .toLocaleString("en-US", { weekday: "long" })
        .toLowerCase();

    const todayWorkout = weeklyPlan.days.find(
        ({ day }) => day.trim().toLowerCase() === today.trim().toLowerCase()
    );

    if (!todayWorkout) {
        throw new Error(`No workout scheduled for ${today}`);
    }

    return { day: today, workout: todayWorkout.exercises };
};

const adaptWeeklyPlanToday = async (userId, reason, modifications) => {
    const weeklyPlan = await WeeklyPlan.findOne({
        user: userId,
        isActive: true
    });

    if (!weeklyPlan) {
        throw new Error("No active weekly plan found to adapt.");
    }

    const today = new Date().toLocaleString("en-US", { weekday: "long" }).toLowerCase();
    const todayWorkoutIndex = weeklyPlan.days.findIndex(
        ({ day }) => day.trim().toLowerCase() === today
    );

    if (todayWorkoutIndex === -1) {
        throw new Error(`No workout scheduled for ${today}.`);
    }

    let exercises = weeklyPlan.days[todayWorkoutIndex].exercises;

    modifications.forEach(mod => {
        const { exerciseId, action, newSets, newDuration } = mod;
        
        if (action === "remove") {
            exercises = exercises.filter(ex => ex.exercise.toString() !== exerciseId);
        } else if (action === "update") {
            const exIndex = exercises.findIndex(ex => ex.exercise.toString() === exerciseId);
            if (exIndex !== -1) {
                if (newSets !== undefined) exercises[exIndex].sets = newSets;
                if (newDuration !== undefined) exercises[exIndex].duration = newDuration;
            }
        }
    });

    weeklyPlan.days[todayWorkoutIndex].exercises = exercises;
    
    console.log(`Adapting workout for user ${userId}. Reason: ${reason}`);

    await weeklyPlan.save();
    
    return { success: true, reason, updatedExercises: exercises.length };
};

module.exports = {
    createPlan,
    getPlans,
    getPlanById,
    updatePlan,
    activatePlan,
    deletePlan,
    getTodayWorkout,
    adaptWeeklyPlanToday
};
