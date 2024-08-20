const express = require('express');
const app = express();
require('dotenv').config();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const usersRouter = require('./controllers/users');
const blogsRouter = require('./controllers/blogs');
const loginRouter = require('./controllers/login');

app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/login', loginRouter);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
