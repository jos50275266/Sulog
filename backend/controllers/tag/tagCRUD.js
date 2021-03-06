const { Blog } = require('../../models/blog');
const { Tag } = require('../../models/tag');
const slugify = require('slug');
const { errorHandler } = require('../../helpers/dbErrorHandler');

exports.create = async (req, res) => {
	const { name } = req.body;

	let slug = slugify(name).toLowerCase();
	let tag = new Tag({ name, slug });

	try {
		await tag.save();
		return res.status(200).json({ message: '태그 생성에 성공했습니다!' });
	} catch (err) {
		return res.status(400).json({ error: errorHandler(err) });
	}
};

exports.read = async (req, res, next) => {
	const slug = req.params.slug.toLowerCase();
	// {index: true} 한 이유, slug 위주로 queries 문 작성

	try {
		let tag = await Tag.findOne({ slug });
		let blogs = await Blog.find({ tags: tag })
			.populate('categories', '_id name slug')
			.populate('tags', '_id name slug')
			.populate('postedBy', '_id name')
			.select('_id title slug  excerpt categories postedBy tags createdAt updatedAt');

		return res.status(200).json({ tag, blogs });
	} catch (err) {
		return res.status(404).json({ error: errorHandler(err) });
	}
};

exports.list = async (req, res, next) => {
	try {
		let allTags = await Tag.find({});
		return res.status(200).json(allTags);
	} catch (err) {
		return res.status(404).json({ error: errorHandler(err) });
	}
};

// exports.read

exports.remove = async (req, res, next) => {
	const slug = req.params.slug.toLowerCase();
	// {index: true} 한 이유, slug 위주로 queries 문 작성
	try {
		let removedTag = await Tag.find({ slug }).select('_id');
		let blogs = await Blog.find({})
			.populate('tags', 'name')
			.select(
				'-photo -categories -like -title -body -excerpt -mtitle -mdesc -createdAt -updatedAt -_id -slug -postedBy -__v'
			);

		let usedTagList = [];

		blogs.forEach((blog) => {
			blog.tags.forEach((innerTag) => {
				usedTagList.push(innerTag._id.toString());
			});
		});

		let removedTagId = removedTag[0]._id.toString();
		let finder = usedTagList.includes(removedTagId);

		if (!finder) {
			await Tag.findOneAndRemove({ slug });
			return res.status(200).json({ message: '태그가 성공적으로 삭제되었습니다.' });
		} else {
			return res.status(400).json({ error: '블로그 생성에 사용된 태그는 삭제할 수 없습니다...' });
		}
	} catch (err) {
		return res.status(400).json({ error: errorHandler(err) });
	}
};
