const express = require('express');
const router = express.Router();

const detailController = require('../controllers/detail.controller');
const auth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/image.upload');

router.put('/update',auth.authMiddleware,upload.single("profilePicture"),detailController.updateDetails);
router.get('/profile',auth.authMiddleware,detailController.getDetails);

module.exports = router;