const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { Blog, User } = require('../models');
const { SECRET } = require('../util/config');
const { Op } = require('sequelize');


router.get('/', async (req, res) => {
  const where = {};

  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${searchTerm}%`
        }
      },
      {
        author: {
          [Op.iLike]: `%${searchTerm}%` 
        }
      }
    ];
  }

  try {
    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name']
      },
      where,
      order: [
        ['likes', 'DESC']
      ]
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};

router.post('/', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    if (!user) {
      return res.status(401).json({ error: 'Invalid user' });
    }
    const blog = await Blog.create({ ...req.body, userId: user.id, date: new Date() });
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: ['name']
      }
    });
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
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

router.put('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    blog.important = req.body.important;
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
