const { logger } = require('../utils/logger');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

module.exports = function() {
	const options = {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	};
	const db = process.env.MONGODB_URI;

	mongoose
		.connect(db, options)
		.then(() => logger.info(`데이터베이스 ${db}에 연결됨...`))
		.catch((err) => logger.error('데이터베이스에 연결할 수 없습니다...'));
};
