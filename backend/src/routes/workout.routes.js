const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth.middleware.js");
const workoutController = require("../controllers/workout.controller.js");

router.post("/start", auth.authMiddleware, workoutController.startWorkout);
router.get("/current", auth.authMiddleware, workoutController.getCurrentWorkout);
router.post("/:workoutId/completed/:exerciseId", auth.authMiddleware, workoutController.completeExercise);
router.post("/:workoutId/skip/:exerciseId", auth.authMiddleware, workoutController.skipExercise);
router.post("/:workoutId/pause", auth.authMiddleware, workoutController.pauseWorkout);
router.post("/:workoutId/resume", auth.authMiddleware, workoutController.resumeWorkout);
router.post("/:workoutId/finish", auth.authMiddleware, workoutController.finishWorkout);

module.exports = router;
