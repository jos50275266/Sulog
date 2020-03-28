const { logger, stream } = require('../utils/logger');
const express = require('express');
const blogRoutes = require('../routes/blog');
const authRoutes = require('../routes/auth');
const userRoutes = require('../routes/user');
const categoryRoutes = require('../routes/category');
const tagRoutes = require('../routes/tag');
const formRoutes = require('../routes/form');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

module.exports = function(app) {
	app.use(express.urlencoded({ extended: true, limit: '50mb', extended: false }));
	app.use(express.json({ limit: '50mb' }));
	app.use(morgan('dev', { stream }));
	app.use(helmet());
	app.use(cookieParser());
	if (process.env.NODE_ENV === 'development') {
		app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
	}
	app.use('/api', blogRoutes);
	app.use('/api', authRoutes);
	app.use('/api', userRoutes);
	app.use('/api', categoryRoutes);
	app.use('/api', tagRoutes);
	app.use('/api', formRoutes);
	app.use(function(error, req, res, next) {
		if (error.name === 'UnauthorizedError') {
			res.status(401).send('Invalid Token...');
		}
	});
};
