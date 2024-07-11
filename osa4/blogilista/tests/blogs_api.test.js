const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const { describe, it, beforeEach, after } = require('node:test')
const assert = require('assert')

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  const blogObjects = helper.initialBlogs.map((blog) => new Blog({ ...blog, user: user._id }))
  const promiseArray = blogObjects.map((blog) => blog.save())
  await Promise.all(promiseArray)
})

describe('when there are initially some blogs saved', () => {
  it('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  it('blog identifier is named id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body;
    blogs.forEach(blog => {
      assert.ok(blog.id)
    })
  })
})

describe('addition of a new blog', () => {
  it('a valid blog can be added', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'John Doe',
      url: 'http://example.com',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(titles.includes('async/await simplifies making async calls'))
  })

  it('if likes is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'Blog with no likes field',
      author: 'Jane Doe',
      url: 'http://example.com',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  it('blog without title or url is not added', async () => {
    const newBlog = {
      author: 'Jane Doe',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})


after(async () => {
  await mongoose.connection.close()
})
