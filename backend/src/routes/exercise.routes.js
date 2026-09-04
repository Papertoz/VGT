const express = require("express");

const router = express.Router();

const exerciseController =
require("../controllers/exercise.controller");

router.post(
    "/create",
    exerciseController.createExercise
);

router.get(
    "/",
    exerciseController.getAllExercises
);

router.get(
    "/:id",
    exerciseController.getExerciseById
);

router.delete(
    "/delete/:id",
    exerciseController.deleteExercisebyId
);
module.exports = router;