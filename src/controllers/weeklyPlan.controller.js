const WeeklyPlan = require("../models/weeklyPlan.model");

const createWeeklyPlan = async (req, res) => {
    try {
        const { planName, description, days, isActive } = req.body;

        // If creating as active, deactivate others
        if (isActive) {
            await WeeklyPlan.updateMany({ user: req.user.id }, { isActive: false });
        }

        // Check if user has any plans. If not, force this one to be active
        const existingPlansCount = await WeeklyPlan.countDocuments({ user: req.user.id });
        const isFirstPlan = existingPlansCount === 0;

        const plan = await WeeklyPlan.create({
            planName,
            description,
            user: req.user.id,
            days,
            isActive: isFirstPlan ? true : (isActive || false)
        });

        res.status(201).json({
            success: true,
            plan
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const getAllWeeklyPlans = async (req, res) => {
    try {
        const plans = await WeeklyPlan.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            plans
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const getWeeklyPlanById = async (req, res) => {
    try {
        const plan = await WeeklyPlan.findOne({ _id: req.params.id, user: req.user.id });
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found"
            });
        }
        res.status(200).json({
            success: true,
            plan
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const updateWeeklyPlan = async (req, res) => {
    try {
        const { planName, description, days, isActive } = req.body;
        
        // Ensure plan exists and belongs to user
        const planToUpdate = await WeeklyPlan.findOne({ _id: req.params.id, user: req.user.id });
        if (!planToUpdate) {
            return res.status(404).json({
                success: false,
                message: "Plan not found"
            });
        }

        if (isActive === true) {
            // Deactivate all other plans
            await WeeklyPlan.updateMany(
                { user: req.user.id, _id: { $ne: planToUpdate._id } },
                { isActive: false }
            );
        }

        const updatedPlan = await WeeklyPlan.findByIdAndUpdate(
            req.params.id,
            { planName, description, days, isActive },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            plan: updatedPlan
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const activateWeeklyPlan = async (req, res) => {
    try {
        const plan = await WeeklyPlan.findOne({ _id: req.params.id, user: req.user.id });
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found"
            });
        }

        // Deactivate all plans for user
        await WeeklyPlan.updateMany({ user: req.user.id }, { isActive: false });

        // Activate the selected plan
        plan.isActive = true;
        await plan.save();

        res.status(200).json({
            success: true,
            message: "Plan activated successfully",
            plan
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const deleteWeeklyPlan = async (req, res) => {
    try {
        const plan = await WeeklyPlan.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found"
            });
        }

        // If the deleted plan was active, automatically activate another plan (most recently created)
        if (plan.isActive) {
            const nextPlan = await WeeklyPlan.findOne({ user: req.user.id }).sort({ createdAt: -1 });
            if (nextPlan) {
                nextPlan.isActive = true;
                await nextPlan.save();
            }
        }

        return res.status(200).json({
            success: true,
            message: "Weekly plan deleted successfully",
            plan
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const getTodayWorkout = async (req, res) => {
    try {
        const weeklyPlan = await WeeklyPlan.findOne({
            user: req.user.id,
            isActive: true
        }).populate("days.exercises.exercise");

        if (!weeklyPlan) {
            return res.status(404).json({
                success: false,
                message: "Active weekly plan not found"
            });
        }

        const today = new Date()
            .toLocaleString("en-US", { weekday: "long" })
            .toLowerCase();

        const todayWorkout = weeklyPlan.days.find(
            ({ day }) => day.trim().toLowerCase() === today.trim().toLowerCase()
        );

        if (!todayWorkout) {
            return res.status(404).json({
                success: false,
                message: `No workout scheduled for ${today}`
            });
        }

        res.status(200).json({
            success: true,
            day: today,
            workout: todayWorkout.exercises
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    createWeeklyPlan,
    getAllWeeklyPlans,
    getWeeklyPlanById,
    updateWeeklyPlan,
    activateWeeklyPlan,
    deleteWeeklyPlan,
    getTodayWorkout
};