const mongoose = require('mongoose');
const cache = require("../services/cache");
const logger = require("../services/logger");
const requireLogin = require('../middlewares/requireLogin');

const Blog = mongoose.model('Blog');

module.exports = app => {
	app.get('/api/blogs/:id', requireLogin, async (req, res) => {
		const blog = await Blog.findOne({
			_user: req.user.id,
			_id: req.params.id
		});

		res.send(blog);
	});

	app.get('/api/blogs', requireLogin, async (req, res) => {
		const logKey = `GET-BLOG-${req.user.id}`;
		try{
			const blogs = await Blog.find({ _user: req.user.id }).cache(req.user.id);
			res.json(blogs);
		}catch(e){
			res.status(400).json(e.message);
			logger.error(logKey, e);
		}
	});

	app.post('/api/blogs', requireLogin, async (req, res) => {
		const logKey = `CREATE-BLOG-${req.user.id}`;
		try{
			logger.info(logKey, req.body);
			const { title, content } = req.body;
			const blog = await Blog.create({
				title,
				content,
				_user: req.user.id
			});
			cache.clear(req.user.id);
			res.json(blog);
		}catch(e){
			res.status(400).json(e.message);
			logger.error(logKey, e);
		}
	});
};
