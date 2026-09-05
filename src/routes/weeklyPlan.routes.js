const weeklyPlanController = require('../controllers/weeklyPlan.controller');
const express = require('express');
const auth = require("../middlewares/auth.middleware.js");
const router = express.Router();

router.post('/create', auth.authMiddleware, weeklyPlanController.createWeeklyPlan);
router.get('/allplans', auth.authMiddleware, weeklyPlanController.getAllWeeklyPlans);
router.get('/today', auth.authMiddleware, weeklyPlanController.getTodayWorkout);
router.get('/:id', auth.authMiddleware, weeklyPlanController.getWeeklyPlanById);
router.patch('/update/:id', auth.authMiddleware, weeklyPlanController.updateWeeklyPlan);
router.patch('/activate/:id', auth.authMiddleware, weeklyPlanController.activateWeeklyPlan);
router.delete('/delete/:id', auth.authMiddleware, weeklyPlanController.deleteWeeklyPlan);

module.exports = router;