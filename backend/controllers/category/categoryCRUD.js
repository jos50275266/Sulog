const { Category } = require('../../models/category');
const { Blog } = require('../../models/blog');
const slugify = require('slug');
const { errorHandler } = require('../../helpers/dbErrorHandler');

exports.create = async (req, res) => {
	const { name } = req.body;
	// new table --> slugify --> new-table
	
	let slug = slugify(name).toLowerCase();
	let category = new Category({ name, slug });

	try {
		await category.save();
		return res.status(200).json({ message: '카테고리 생성에 성공했습니다!' });
	} catch (err) {
		return res.status(400).json({ error: errorHandler(err) });
	}
};

exports.list = async (req, res) => {
	try {
		let allCategories = await Category.find({});
		return res.status(200).json(allCategories);
	} catch (err) {
		return res.status(404).json({ error: errorHandler(err) });
	}
};

exports.read = async (req, res, next) => {
	const slug = req.params.slug.toLowerCase();

	try {
		let category = await Category.findOne({ slug });
		let blogs = await Blog.find({})
			.populate('categories', '_id name slug')
			.populate('tags', '_id name slug')
			.populate('postedBy', '_id name username')
			.select('_id title slug excerpt categories postedBy tags createdAt updatedAt');

		return res.json({ category, blogs });
	} catch (err) {
		return res.status(400).json({ error: errorHandler(err) });
	}
};

exports.remove = async (req, res) => {
	const slug = req.params.slug.toLowerCase();
	// {index: true} 한 이유, slug 위주로 queries 문 작성
	try {
		await Category.findOneAndRemove({ slug });
		return res.status(200).json({ message: '카테고리가 성공적으로 삭제되었습니다.' });
	} catch (err) {
		return res.status(400).json({ error: errorHandler(err) });
	}
};
