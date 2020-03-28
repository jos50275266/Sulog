const Joi = require('@hapi/joi');

exports.categoryCreateValidator = (req, res) => {
	const schema = Joi.object({
		name: Joi.string().min(1).max(32).required()
	});

	return schema.validate(req);
};
