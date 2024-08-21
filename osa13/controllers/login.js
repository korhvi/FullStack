const jwt = require('jsonwebtoken');
const router = require('express').Router();
const { SECRET } = require('../util/config');
const { User, Session } = require('../models');

router.post('/', async (request, response) => {
  const body = request.body;

  try {
    const user = await User.findOne({
      where: { username: body.username },
    });

    if (!user || user.disabled || body.password !== 'salainen') {
      return response.status(401).json({
        error: 'invalid username or password',
      });
    }

    const userForToken = {
      username: user.username,
      id: user.id,
    };

    const token = jwt.sign(userForToken, SECRET);

    await Session.create({
      token,
      userId: user.id,
      valid: true,
    });

    response.status(200).send({ token, username: user.username, name: user.name });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
