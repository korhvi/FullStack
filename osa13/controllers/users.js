const router = require('express').Router();
const { User, Blog } = require('../models');

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
  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
        through: {
          attributes: []
        }
      }
    ]
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
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
