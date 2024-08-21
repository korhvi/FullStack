const express = require('express');
const { ReadingList } = require('../models');

const router = express.Router();

router.post('/', async (req, res) => {
  const { user_id, blog_id } = req.body;

  const readingListEntry = await ReadingList.create({
    userId: user_id,
    blogId: blog_id,
  });

  res.status(201).json(readingListEntry);
});

module.exports = router;
