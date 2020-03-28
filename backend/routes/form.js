const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { contactForm, contactBlogAuthorForm } = require('../controllers/form/form');
const { contactFormValidator } = require('../validators/form');

router.post('/contact', validate(contactFormValidator), contactForm);
router.post('/contact-blog-author', validate(contactFormValidator), contactBlogAuthorForm);

module.exports = router;
