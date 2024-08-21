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

router.put('/:id', async (req, res) => {
  const { read } = req.body;

  console.log(`Received PUT request for ReadingList entry with ID: ${req.params.id}`);

  try {
    const readingListEntry = await ReadingList.findByPk(req.params.id);

    if (!readingListEntry) {
      console.error('Reading list entry not found');
      return res.status(404).json({ error: 'Reading list entry not found' });
    }

    readingListEntry.read = read !== undefined ? read : readingListEntry.read;
    await readingListEntry.save();

    console.log('Reading list entry updated successfully');
    res.json(readingListEntry);
  } catch (error) {
    console.error('Error updating reading list entry:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
