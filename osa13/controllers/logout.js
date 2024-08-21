const router = require('express').Router();
const { Session } = require('../models');
const tokenExtractor = require('../middleware/tokenExtractor');

router.delete('/', tokenExtractor, async (request, response) => {
  try {
    const token = request.get('authorization').substring(7);
    
    const session = await Session.findOne({
      where: { token, valid: true },
    });

    if (!session) {
      return response.status(401).json({ error: 'session invalid or expired' });
    }

    session.valid = false;
    await session.save();

    response.status(204).end();
  } catch (error) {
    console.error('Logout failed:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
