const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: 'Validation error' });
  }

  if (err.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: 'Database error' });
  }

  return res.status(500).json({ error: 'Internal server error' });
};

module.exports = errorHandler;
