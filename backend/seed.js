const { User } = require('./models/user');
const { Blog } = require('./models/blog');
const { Tag } = require('./models/tag');
const { Category } = require('./models/category');
const { logger } = require('./utils/logger');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const options = {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
};

async function seed() {
	const db = process.env.MONGODB_URI;
	await mongoose.connect(db, options);

	await User.deleteMany({});
	await Blog.deleteMany({});
	await Tag.deleteMany({});
	await Category.deleteMany({});

	await mongoose.disconnect();
	return logger.info('Done!');
}

seed();
