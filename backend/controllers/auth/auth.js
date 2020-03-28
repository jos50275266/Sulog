// third-party modules
const sgMail = require('@sendgrid/mail');
const _ = require('lodash');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const shortId = require('shortid');
const { OAuth2Client } = require('google-auth-library');
const { errorHandler } = require('../../helpers/dbErrorHandler');

// models
const { User } = require('../../models/user');
dotenv.config();
// sendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// googleLogin
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.preSignup = async (req, res) => {
	const { name, email, password } = req.body;

	let user = await User.findOne({
		email: email.toLowerCase()
	});
	if (user)
		return res.status(400).json({
			error: '이미 등록된 이메일입니다...'
		});

	const token = jwt.sign(
		{
			name,
			email,
			password
		},
		process.env.JWT_ACCOUNT_ACTIVATION,
		{
			expiresIn: '10m'
		}
	);

	const emailData = {
		from: process.env.EMAIL_FROM,
		to: email,
		subject: `계정 활성화 링크`,
		html: `
          <p>계정 활성화 링크입니다! (10 분 안에 새로 설정해주세요!):</p>
          <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
          <hr />
          <p>이 메일에는 민감한 정보가 포함되어있습니다...</p>
          <p>https://www.sulog.com</p>
      `
	};

	sgMail
		.send(emailData)
		.then(() => {
			console.log('then');
			res.json({
				message: `새 계정 설정 절차가 ${email}로 전송되었습니다... (해당 링크는 10분 후에 만료됩니다...) 지침에 따라 새 계정을 설정해주세요! `
			});
		})
		.catch((err) => {
			res.status(401).json({
				error: errorHandler(err)
			});
		});
};

// https://itnext.io/building-restful-api-with-node-js-express-js-and-postgresql-the-right-way-b2e718ad1c66
exports.signup = (req, res, next) => {
	const token = req.body.token;
	if (!token) {
		return res.status(401).json({ message: '토큰이 존재하지않습니다. 다시 시도해주세요!' });
	}

	jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async function(err, decoded) {
		if (err) res.status(401).json({ error: '만료된 토큰, 다시 회원가입해주세요!' });

		const { name, email, password } = jwt.decode(token);
		let username = shortId.generate();
		let profile = `${process.env.CLIENT_URL}/profile/${username}`;

		let user = new User({ name, email, password, profile, username });

		try {
			user.salt = await user.makeSalt();
			user.hashed_password = await user.encryptPassword(password);
			await user.save();
			return res.status(200).json({ message: '회원가입에 성공했습니다! 로그인해주세요!' });
		} catch (err) {
			return res.status(400).json({ error: err });
		}
	});
};

exports.signin = async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return res.status(400).json({ error: '등록되지않은 계정입니다...' });
	}

	// 민감한 정보를 보내지 않기 위해서.
	const { _id, username, name, email, role } = user;

	const validPassword = await user.authenticate(req.body.password);
	if (!validPassword) {
		return res.status(400).json({ error: '해당 이메일과 입력하신 비밀번호가 일치하지않습니다.' });
	}

	const token = user.generateAuthToken();

	res.cookie('token', token, { expiresIn: '1d' });
	res.header('x-auth-token', token).status(200).send({ token, user: { _id, username, name, email, role } });
};

exports.logout = (req, res, next) => {
	res.clearCookie('token');
	res.status(200).json({ message: '로그아웃 되었습니다.' });
};

exports.googleLogin = (req, res) => {
	const idToken = req.body.tokenId;
	client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID }).then((response) => {
		const { email_verified, name, email, jti } = response.payload;
		if (email_verified) {
			User.findOne({ email }).then(async (user) => {
				if (user) {
					const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
					res.cookie('token', token, { expiresIn: '1d' });
					const { _id, email, name, role, username } = user;
					return res.json({ token, user: { _id, email, name, role, username } });
				} else {
					let username = shortId.generate();
					let profile = `${process.env.CLIENT_URL}/profile/${username}`;
					let password = jti;
					user = new User({ name, email, profile, username });

					try {
						user.salt = await user.makeSalt();
						user.hashed_password = await user.encryptPassword(password);

						user = await user.save();

						const token = user.generateAuthToken();
						res.cookie('token', token, { expiresIn: '1d' });
						const { _id, email, name, role, username } = user;

						return res.status(200).json({
							token,
							user: { _id, email, name, role, username }
						});
					} catch (err) {
						return res.status(400).json({ error: err });
					}
				}
			});
		}
	});
};
