const express = require('express');
const router = express.Router();
const { create, list, read, remove } = require('../controllers/tag/tagCRUD');
const validate = require('../middleware/validate');
const { tagCreateValidator } = require('../validators/tag');
const { requireSignin, adminMiddleware } = require('../controllers/auth/authHelpers');

router.get('/tags', list);
router.get('/tag/:slug', read);
router.post('/tag', validate(tagCreateValidator), requireSignin, adminMiddleware, create);
router.delete('/tag/:slug', requireSignin, adminMiddleware, remove);

module.exports = router;
