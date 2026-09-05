const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// The single entry point for all authentication (Google, Email/Password, Signup, Login)
// The frontend handles the flow with Firebase SDK and sends the ID token here.
router.post('/firebase-login', authController.firebaseLogin);

module.exports = router;