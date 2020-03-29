// Third-Party Modules
const formidable = require('formidable');
const slugify = require('slug');
const stripHTML = require('string-strip-html');
const _ = require('lodash');
const { errorHandler } = require('../../helpers/dbErrorHandler');
const fs = require('fs');
const { smartTrim } = require('../../helpers/blog');

// Models
const { User } = require('../../models/user');
const { Category } = require('../../models/category');
const { Tag } = require('../../models/tag');
const { Blog } = require('../../models/blog');

exports.create = (req, res) => {
	let form = new formidable.IncomingForm();
	form.encoding = 'utf-8';
	form.multiples = true;
	form.keepExtensions = true;

	form.parse(req, async (err, fields, files) => {
		if (err) {
			return res.status(400).json({
				error: err
			});
		}

		const { title, body, categories, tags, excerpt } = fields;

		if (!title || !title.length || title <= 1) {
			return res.status(400).json({
				error: '제목을 최소 한 글자 입력해주세요'
			});
		}

		if (!excerpt || excerpt.length < 10) {
			return res.status(400).json({
				error: '10 글자 이상의 소개글을 작성해주세요'
			});
		}

		if (!body || !body.length) {
			return res.status(400).json({
				error: '입력하신 내용의 길이가 너무 짧습니다.'
			});
		}

		if (!categories || categories.length === 0) {
			return res.status(400).json({
				error: '적어도 한 개 이상의 카테고리를 선택해주세요.'
			});
		}

		if (!tags || tags.length === 0) {
			return res.status(400).json({
				error: '적어도 한 개 이상의 테그를 선택해주세요'
			});
		}

		let blog = new Blog();
		blog.title = title;
		blog.body = body;
		blog.excerpt = smartTrim(excerpt, 60, ' ', ' ...'); // delimiter " ", appendix " ..."
		blog.slug = slugify(title).toLowerCase();
		blog.mtitle = `${title} | ${process.env.APP_NAME}`;
		blog.mdesc = stripHTML(body.substring(0, 160)); // Ignore HTML Tag
		blog.postedBy = req.user._id; // From signIn and express-jwt middleware
		blog.categories = categories && categories.split(',');
		blog.tags = tags && tags.split(',');

		if (files.photo) {
			// 1 megabyte
			if (files.photo.size > 10000000) {
				return res.status(400).json({
					error: 'Image should be less then 1mb in size'
				});
			}

			blog.photo.data = fs.readFileSync(files.photo.path);
			blog.photo.contentType = files.photo.type;
		}

		try {
			let savedblog = await blog.save();
			return res.status(201).json(savedblog);
		} catch (err) {
			return res.status(400).json({ error: errorHandler(err) });
		}
	});
};

exports.list = async (req, res) => {
	try {
		const allBlogs = await Blog.find({})
			.populate('categories', '_id name slug')
			.populate('tags', '_id name slug')
			.populate('postedBy', '_id name username')
			.select('_id title slug excerpt categories tags postedBy createdBy updatedBy');
		return res.status(200).json(allBlogs);
	} catch (err) {
		return res.status(400).json({ error: errorHandler(err) });
	}
};

exports.list_Blogs_Categories_Tags = async (req, res) => {
	let limit = req.body.limit ? parseInt(req.body.limit) : 10;
	let skip = req.body.skip ? parseInt(req.body.skip) : 0;

	try {
		let blogs = await Blog.find({})
			.populate('categories', '_id name slug')
			.populate('tags', '_id name slug')
			.populate('postedBy', '_id name username')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.select('_id title slug excerpt categories tags postedBy createdBy updatedAt');
		let categories = await Category.find({});
		let tags = await Tag.find({});

		return res.status(200).json({ blogs, categories, tags, size: blogs.length });
	} catch (err) {
		return res.status(400).json({ error: errorHandler(err) });
	}
};

exports.read = async (req, res) => {
	const slug = req.params.slug.toLowerCase();
	try {
		let blog = await Blog.findOne({ slug })
			.populate('categories', '_id name slug')
			.populate('tags', '_id name slug')
			.populate('postedBy', '_id name username')
			.select('_id title body excerpt slug mtitle mdesc categories tags postedBy createdBy updatedAt');
		return res.status(200).json(blog);
	} catch (err) {
		return res.status(400).json({ error: errorHandler(err) });
	}
};

exports.remove = async (req, res) => {
	const slug = req.params.slug.toLowerCase();
	try {
		await Blog.findOneAndRemove({ slug });
		return res.status(200).json({ message: '성공적으로 글이 삭제되었습니다.' });
	} catch (err) {
		return res.status(400).json({ error: errorHandler(err) });
	}
};

exports.update = async (req, res) => {
	const slug = req.params.slug.toLowerCase();
	try {
		let oldBlog = await Blog.findOne({ slug });

		let form = new formidable.IncomingForm();
		form.encoding = 'utf-8';
		form.multiples = true;
		form.keepExtensions = true;

		form.parse(req, async (err, fields, files) => {
			if (err) {
				return res.status(400).json({ error: err });
			}

			// blog-one --> blog-one-about-react 로 변경시 비록 title은 변경되었어도
			// slug를 regenerate 할 수 없기 때문에 slug 값을 그대로 유지한다.
			// 그 이유는 blog를 일단 생성하면, 해당 blog의 url이 indexed by google 되기 때문이다.
			// SEO 에서는 slug 값을 변경하지 않아야 최적으로 동작한다.

			// This fields is getting from client side
			// 모든 fields를 update하는 것이 아닌 필요한 부분만 update 하기 위해 lodash.merge 사용.
			let slugBeforeMerge = oldBlog.slug;

			oldBlog = _.merge(oldBlog, fields);
			oldBlog.slug = slugBeforeMerge;

			const { title, body, categories, tags, excerpt } = fields;

			if (title) {
				oldBlog.title = title;
			}

			if (excerpt) {
				oldBlog.excerpt = smartTrim(excerpt, 60, ' ', ' ...');
			}

			if (body) {
				oldBlog.mdesc = stripHTML(body.substring(0, 160));
				oldBlog.body = body;
			}

			if (categories) {
				oldBlog.categories = categories.split(',');
			}

			if (tags) {
				oldBlog.tags = tags.split(',');
			}

			if (files.photo) {
				if (files.photo.size > 100000000) {
					return res.status(400).json({ error: '이미지사이즈는 반드시 1mb 이하야 합니다.' });
				}
				oldBlog.photo.data = fs.readFileSync(files.photo.path);
				oldBlog.photo.contentType = files.photo.type;
			}

			let updatedBlog = await oldBlog.save();
			return res.status(200).json(updatedBlog);
		});
	} catch (err) {
		return res.status(400).json({ error: errorHandler(err) });
	}
};

exports.photo = async (req, res) => {
	const slug = req.params.slug.toLowerCase();
	try {
		let blog = await Blog.findOne({ slug }).select('photo');
		res.set('Content-Type', blog.photo.contentType);
		return res.send(blog.photo.data);
	} catch (err) {
		return res.status(400).json({ error: errorHandler(err) });
	}
};

exports.listRelated = async (req, res) => {
	let limit = req.body.limit ? parseInt(req.body.limit) : 3;
	const { _id, categories } = req.body.blog;

	try {
		let relatedBlogs = await Blog.find({
			_id: { $ne: _id },
			categories: { $in: categories }
		})
			.limit(limit)
			.populate('postedBy', '_id name profile')
			.select('title slug excerpt postedBy createdAt updatedAt');

		return res.status(200).json(relatedBlogs);
	} catch (err) {
		return res.status(400).json({ error: errorHandler(err) });
	}
};

exports.listSearch = async (req, res) => {
	const { search } = req.query;
	let searchResults;

	try {
		if (search) {
			searchResults = await Blog.find({
				$or: [ { title: { $regex: search, $options: 'i' } }, { body: { $regex: search, $options: 'i' } } ]
			});

			return res.status(200).json(searchResults);
		}
	} catch (err) {
		return res.status(400).json({ error: errorHandler(err) });
	}
};

exports.listByUser = async (req, res) => {
	try {
		let user = await User.findOne({ username: req.params.username });
		let listByUser = await Blog.find({ postedBy: user._id })
			.populate('categories', '_id name slug')
			.populate('tags', '_id name slug')
			.populate('postedBy', '_id name username')
			.select('_id title slug postedBy createdAt updatedAt');

		return res.status(200).json(listByUser);
	} catch (err) {
		return res.status(400).json({ error: errorHandler(err) });
	}
};

exports.like = async (req, res) => {
	const slug = req.params.slug.toLowerCase();
	try {
		let likeData = await Blog.findOne({ slug }).select('like');
		return res.status(200).json(likeData);
	} catch (err) {
		return res.status(400).json({ error: errorHandler(err) });
	}
};

exports.likeUpdate = async (req, res) => {
	const slug = req.params.slug.toLowerCase();
	try {
		let oldBlog = await Blog.findOne({ slug }).select('like');
		const checker = oldBlog.like.includes(req.profile._id);

		if (checker) {
			let likeIndex = oldBlog.like.indexOf(req.profile._id);
			oldBlog.like.splice(likeIndex, 1);
		} else {
			oldBlog.like.push(req.profile._id);
		}

		let updatedBlog = await oldBlog.save();
		return res.status(200).json(updatedBlog);
	} catch (err) {
		return res.status(400).json({ error: errorHandler(err) });
	}
};
