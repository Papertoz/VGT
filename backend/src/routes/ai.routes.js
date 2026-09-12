const express = require("express");
const { chat, generateProgressReport, getRecoverySuggestions, evaluateGoal, checkSafety } = require("../controllers/ai.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/chat", authMiddleware, chat);
router.get("/progress-report", authMiddleware, generateProgressReport);
router.get("/recovery-suggestions", authMiddleware, getRecoverySuggestions);
router.post("/evaluate-goal", authMiddleware, evaluateGoal);
router.post("/safety-check", authMiddleware, checkSafety);

router.get("/repair", async (req, res) => {
    try {
        const WeeklyPlan = require('../models/weeklyPlan.model');
        const Exercise = require('../models/exercise.model');
        const allExercises = await Exercise.find();
        if (allExercises.length === 0) return res.send('No exercises');
        const getRandomExercise = () => allExercises[Math.floor(Math.random() * allExercises.length)]._id;
        const plans = await WeeklyPlan.find();
        let updatedCount = 0;
        for (let plan of plans) {
            let planModified = false;
            if (plan.days && plan.days.length > 0) {
                for (let day of plan.days) {
                    if (day.exercises && day.exercises.length > 0) {
                        for (let ex of day.exercises) {
                            if (!ex.exercise) continue;
                            const exists = allExercises.find(e => e._id.toString() === ex.exercise.toString());
                            if (!exists) {
                                ex.exercise = getRandomExercise();
                                planModified = true;
                            }
                        }
                    }
                }
            }
            if (planModified) {
                await plan.save();
                updatedCount++;
            }
        }
        res.send(`Repaired ${updatedCount} plans`);
    } catch(err) { res.status(500).send(err.message); }
});

module.exports = router;
 