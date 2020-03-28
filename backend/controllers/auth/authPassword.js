// models
const { User } = require('../../models/user');

// 3rd-Party Modules
const _ = require('lodash');
const dotenv = require('dotenv');
const { errorHandler } = require('../../helpers/dbErrorHandler');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
dotenv.config();
// Sendgrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		let user = await User.findOne({ email });
		let token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' });

		const emailData = {
			from: process.env.EMAIL_FROM,
			to: email,
			subject: `새 비밀번호 설정 링크`,
			html: `
                <p>새 비밀번호 설정 링크 입니다 (10 분 안에 새로 설정해주세요!):</p>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>https://www.sulog.com</p>
                    `
		};

		// populating the db > user > resetPasswordLink
		await user.updateOne({ resetPasswordLink: token });
		await sgMail.send(emailData);

		return res
			.status(200)
			.json({ message: `새 비밀번호 설정 절차가 ${email}로 전송되었습니다... (해당 링크는 10분 후에 만료됩니다...) 지침에 따라 새 비밀번호를 설정해주세요! ` });
	} catch (err) {
		return res.status(400).json({ error: errorHandler(err) });
	}
};

// exports.resetPassword = (req, res) => {
// 	console.log(req.body);
// 	const { resetPasswordLink, newPassword } = req.body;
// 	if (resetPasswordLink) {
// 		jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
// 			if (err) return res.status(401).json({ error: '만료된 토큰입니다! 다시 시도해주세요!' });
// 			User.findOne({ resetPasswordLink })
// 				.then((user) => {
// 					if (!user) res.status(401).json({ error: '다시 시도해주세요!' });

// 					user.resetPasswordLink = '';
// 					user.salt = user.makeSalt();
// 					user.hashed_password = user.encryptPassword(newPassword);
// 					user.save();
// 					return res.status(200).json({ message: `새 비밀번호 설정 성공! 다시 로그인주세요!` });
// 				})
// 				.catch((err) => res.status(401).json({ error: '다시 시도해주세요!' }));
// 		});
// 	}
// };

exports.resetPassword = (req, res) => {
	const { resetPasswordLink, newPassword } = req.body;

	if (resetPasswordLink) {
		jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
			if (err) {
				return res.status(401).json({
					error: '유요하지않은 토큰입니다... 다시 시도해주세요!'
				});
			}

			User.findOne({ resetPasswordLink })
				.then(async (user) => {
					if (!user) {
						return res.status(401).json({
							error: '만료된 링크입니다. 다시 시도해주세요!'
						});
					}
					user.resetPasswordLink = '';
					user.salt = await user.makeSalt();
					user.hashed_password = await user.encryptPassword(newPassword);
					await user.save();
					return res.json({
						message: `성공적으로 비밀번호가 변경되었습니다. 다시 로그인해주세요!`
					});
				})
				.catch((err) => {
					return res.status(400).json({
						error: errorHandler(err)
					});
				});
		});
	}
};
