// 3rd Party Modules
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const { logger } = require('./utils/logger');

const app = express();

require('./startup/logging');
require('./startup/routes')(app);
require('./startup/db')();

const port = process.env.PORT || 8000;
app.listen(port, () => {
	logger.info(`현재 서버가 ${port} 에서 실행중입니다...`);
});
