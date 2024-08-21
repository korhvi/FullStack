const router = require('express').Router();
const { User, Blog, ReadingList } = require('../models');

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Blog,
        attributes: { exclude: ['userId'] }
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.errors.map(e => e.message) });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { read } = req.query;

  try {
    const whereClause = {};
    if (read !== undefined) {
      whereClause.read = read === 'true';
    }

    const user = await User.findByPk(id, {
      include: [
        {
          model: Blog,
          as: 'readings',
          attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
          through: {
            model: ReadingList,
            as: 'readingList',
            attributes: ['id', 'read'],
            where: whereClause,
          },
        },
      ],
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.name = req.body.name;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.errors.map(e => e.message) });
  }
});

module.exports = router;
