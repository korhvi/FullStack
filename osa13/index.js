require('dotenv').config();
const { Sequelize, Model, DataTypes } = require('sequelize');
const express = require('express');
const app = express();

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
