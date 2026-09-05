const express = require("express");
const { chat, generateProgressReport, getRecoverySuggestions, evaluateGoal, checkSafety } = require("../controllers/ai.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/chat", authMiddleware, chat);
router.get("/progress-report", authMiddleware, generateProgressReport);
router.get("/recovery-suggestions", authMiddleware, getRecoverySuggestions);
router.post("/evaluate-goal", authMiddleware, evaluateGoal);
router.post("/safety-check", authMiddleware, checkSafety);

module.exports = router;
