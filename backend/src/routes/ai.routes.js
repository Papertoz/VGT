const express = require("express");
const { chat } = require("../controllers/ai.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/chat", authMiddleware, chat);

module.exports = router;
