const express = require('express');
const router = express.Router();

const {
	create,
	list,
	list_Blogs_Categories_Tags,
	read,
	remove,
	update,
	photo,
	listRelated,
	listSearch,
	listByUser,
	like,
	likeUpdate
} = require('../controllers/blog/blogCRUD');

const {
	requireSignin,
	adminMiddleware,
	authMiddleware,
	canUpdateDeleteBlog
} = require('../controllers/auth/authHelpers');

// GET Method
router.get('/blogs', list);
router.get('/blog/:slug', read);
router.get('/blog/photo/:slug', photo);
router.get('/blogs/search', listSearch);
router.get('/:username/blogs', listByUser);
router.get('/user/like/:slug', like);

// POST METHOD
router.post('/blog', requireSignin, adminMiddleware, create);
router.post('/blogs-categories-tags', list_Blogs_Categories_Tags);
router.post('/blogs/related', listRelated);
router.post('/user/blog', requireSignin, authMiddleware, create);

// PUT METHOD
router.put('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, update);
router.put('/blog/:slug', requireSignin, adminMiddleware, update);
router.put('/user/like/:slug', requireSignin, authMiddleware, likeUpdate);

// DELETE METHOD
router.delete('/blog/:slug', requireSignin, adminMiddleware, remove);
router.delete('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, remove);

module.exports = router;
