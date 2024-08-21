const Blog = require('./blog');
const User = require('./user');
const ReadingList = require('./reading_list');
const Session = require('./session');

Blog.belongsTo(User);
User.hasMany(Blog);
User.hasMany(ReadingList);
User.hasMany(Session);

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' });
Blog.belongsToMany(User, { through: ReadingList, as: 'readers' });

module.exports = {
  Blog,
  User,
  ReadingList,
  Session
};
