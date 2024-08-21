const router = require('express').Router();
const { Blog, User } = require('../models');
const { Op } = require('sequelize');
const tokenExtractor = require('../middleware/tokenExtractor');

router.get('/', async (req, res) => {
  const where = {};

  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    where[Op.or] = [
      { title: { [Op.iLike]: `%${searchTerm}%` } },
      { author: { [Op.iLike]: `%${searchTerm}%` } }
    ];
  }

  try {
    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name'],
      },
      where,
      order: [['likes', 'DESC']],
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', tokenExtractor, async (req, res) => {
  try {
    const { year } = req.body;
    if (year < 1991 || year > new Date().getFullYear()) {
      return res.status(400).json({ error: 'Year must be between 1991 and the current year.' });
    }

    const user = await User.findByPk(req.decodedToken.id);
    if (!user) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    const blog = await Blog.create({ ...req.body, userId: user.id });
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', tokenExtractor, async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    if (blog.userId !== req.decodedToken.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await blog.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
