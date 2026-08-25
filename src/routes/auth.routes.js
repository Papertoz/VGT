const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const authController = require('../controllers/auth.controller');

router.post('/register',authController.registeruser);
router.post('/login',authController.loginuser);

module.exports = router;