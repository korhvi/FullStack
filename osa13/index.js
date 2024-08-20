require('dotenv').config();
const { Sequelize, Model, DataTypes } = require('sequelize');
const express = require('express');
const app = express();

app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL);

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.STRING,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
});

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

app.post('/api/blogs', async (req, res) => {
  const { author, url, title, likes } = req.body;
  
  try {
    const newBlog = await Blog.create({ author, url, title, likes });
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    await blog.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

(async () => {
  await sequelize.sync({ force: true });

  await Blog.create({ author: 'Matti Meikäläinen', url: 'http://blogsite.fi/kaunis-syksy', title: 'Kaunis Syksy' });
  await Blog.create({ author: 'Liisa Virtanen', url: 'http://virtasenajatuksia.fi/viisauden-alkupera', title: 'Viisauden Alkuperä' });

  console.log('Blogs created');
})();
