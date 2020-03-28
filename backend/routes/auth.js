const express = require('express');
const router = express.Router();

const { preSignup, signup, signin, logout, googleLogin } = require('../controllers/auth/auth');
const { forgotPassword, resetPassword } = require('../controllers/auth/authPassword');
const {
	userSignupValidator,
	userSigninValidator,
	forgotPasswordValidator,
	resetPasswordValidator
} = require('../validators/auth');
const validate = require('../middleware/validate');

router.get('/logout', logout);

router.post('/pre-signup', validate(userSignupValidator), preSignup);
router.post('/signup', signup);
router.post('/signin', validate(userSigninValidator), signin);
router.post('/google-login', googleLogin);

router.put('/forgot-password', validate(forgotPasswordValidator), forgotPassword);
router.put('/reset-password', validate(resetPasswordValidator), resetPassword);

module.exports = router;
