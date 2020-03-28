const express = require('express');
const router = express.Router();
const { create, list, read, remove } = require('../controllers/category/categoryCRUD');

// Validators
const validate = require('../middleware/validate');
const { categoryCreateValidator } = require('../validators/category');
const { requireSignin, adminMiddleware } = require('../controllers/auth/authHelpers');

router.get('/categories', list);
router.get("/category/:slug", read);
router.post('/category', validate(categoryCreateValidator), requireSignin, adminMiddleware, create);
router.delete('/category/:slug', requireSignin, adminMiddleware, remove);

module.exports = router;
