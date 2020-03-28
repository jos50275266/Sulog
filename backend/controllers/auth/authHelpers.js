const { User } = require('../../models/user');
const { Blog } = require('../../models/blog');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// https://github.com/auth0/express-jwt
// By default, the decoded token is attached to req.user but can be configured with the requestProperty option.
exports.requireSignin = function(req, res, next) {
	const token = req.header('x-auth-token');
	if (!token) {
		return res.status(401).send('접근 권한에 사용되는 유효한 토큰이 없습니다... 다시 로그인 해주세요...');
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (ex) {
		return res.status(400).send('유효하지않은 토큰...');
	}
};

exports.authMiddleware = async function(req, res, next) {
	const authUserId = req.user._id;
	const user = await User.findById({
		_id: authUserId
	});
	if (!user) {
		return res.status(404).json({ error: '사용자를 찾지 못했습니다...' });
	}

	req.profile = user;
	next();
};

exports.adminMiddleware = async function(req, res, next) {
	const adminUserId = req.user._id;
	const user = await User.findById({
		_id: adminUserId
	});
	if (!user) {
		return res.status(404).json({
			error: '해당 아이디의 사용자를 찾지 못했습니다...'
		});
	}

	//   401: Unauthorized, 403: Forbidden: authorized는 있는데 금지된 리소스
	if (user.role !== 1) {
		return res.status(403).json({
			error: '관리자 권한의 사용자만 접근할 수 있습니다..'
		});
	}

	req.profile = user;
	next();
};

exports.canUpdateDeleteBlog = async (req, res, next) => {
	const slug = req.params.slug.toLowerCase();
	try {
		let authorizedUser = await Blog.findOne({ slug });

		let checker = authorizedUser.postedBy._id.toString() === req.profile._id.toString();
		if (!checker) {
			return res.status(400).json({ error: '해당 글에 권한이 없습니다...' });
		}

		next();
	} catch (err) {
		return res.status(400).json({ error: errorHandler(err) });
	}
};
