const { User } = require('../../models/user');
const { Blog } = require('../../models/blog');
const { errorHandler } = require('../../helpers/dbErrorHandler');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');

exports.read = (req, res) => {
	// authMiddleware 에서 token으로 부터 decode한 값을 profile에 담아주기...
	req.profile.hashed_password = undefined;
	return res.json(req.profile);
};

exports.publicProfile = async (req, res) => {
	let username = req.params.username;

	try {
		let user = await User.findOne({ username });
		user.photo = undefined;

		let blogs = await Blog.find({ postedBy: user._id })
			.populate('categories', '_id name slug')
			.populate('tags', '_id name slug')
			.populate('postedBy', '_id name')
			.limit(10)
			.select('_id title slug excerpt categories tags postedBy createdAt updatedAt');

		return res.status(200).json({ user, blogs });
	} catch (err) {
		return res.status(400).json({ error: errorHandler(err) });
	}
};

exports.update = (req, res) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(req, async (err, fields, files) => {
		if (err) {
			return res.status(400).json({
				error: '사진이 업데이트되지 않았습니다'
			});
		}
		let user = req.profile;
		user = _.extend(user, fields);

		if (fields.password && fields.password.length < 6) {
			return res.status(400).json({
				error: '패스워드는 최소 6 글자 이상 필요합니다.'
			});
		}

		if (files.photo) {
			if (files.photo.size > 10000000) {
				return res.status(400).json({
					error: 'Image should be less than 1mb'
				});
			}
			user.photo.data = fs.readFileSync(files.photo.path);
			user.photo.contentType = files.photo.type;
		}

		try {
			let user = await user.save();

			user.hashed_password = undefined;
			user.salt = undefined;
			user.photo = undefined;

			return res.status(200).json(user);
		} catch (err) {
			return res.status(400).json({ error: errorHandler(err) });
		}
	});
};

exports.photo = async (req, res) => {
	const username = req.params.username;

	try {
		let user = await User.findOne({ username });
		if (user.photo.data) {
			res.set('Content-Type', user.photo.contentType);
			return res.send(user.photo.data);
		}
	} catch (err) {
		return res.status(400).json({ error: '사용자를 찾지 못했습니다.' });
	}
};

exports.getWriterProfile = async (req, res) => {
	const username = req.params.username.toLowerCase();

	try {
		let user = User.findOne({ username });
		return res.send(user);
	} catch (err) {
		return res.status(400).json({ error: '블로그를 찾지 못했습니다.' });
	}
};
