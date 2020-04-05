const Joi = require('@hapi/joi');

exports.contactFormValidator = (req, res) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(255).required(),
		email: Joi.string().min(5).max(255).email().required(),
		message: Joi.string().min(5).required()
	});

	return schema.validate(req);
};

exports.contactFormAuthorValidator = (req, res) => {
	const schema = Joi.object({
		authorEmail: Joi.string().min(3).max(255).email().required(),
		name: Joi.string().min(3).max(255).required(),
		email: Joi.string().min(5).max(255).email().required(),
		message: Joi.string().min(5).required()
	});

	return schema.validate(req);
};
