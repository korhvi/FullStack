const router = require('express').Router();
const { Blog } = require('../models');
const { fn, col } = require('sequelize');

router.get('/', async (req, res) => {
  try {
    const authors = await Blog.findAll({
      attributes: [
        'author',
        [fn('COUNT', col('id')), 'blogs'],
        [fn('SUM', col('likes')), 'likes']
      ],
      group: ['author'],
      order: [[fn('SUM', col('likes')), 'DESC']]
    });

    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
