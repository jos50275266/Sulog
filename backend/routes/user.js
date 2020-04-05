const express = require('express');
const router = express.Router();

const { requireSignin, authMiddleware } = require('../controllers/auth/authHelpers');
const { read, publicProfile, update, photo, getWriterProfile } = require('../controllers/user/userCRUD');

router.get('/user/profile', requireSignin, authMiddleware, read);
router.get('/user/:username', publicProfile);
router.get('/user/photo/:username', photo);
router.get('/user/writer/:username', getWriterProfile);
router.put('/user/update', requireSignin, authMiddleware, update);

module.exports = router;
