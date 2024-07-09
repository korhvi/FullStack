const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'First Blog',
    author: 'Author One',
    url: 'http://example.com/1',
    likes: 1,
  },
  {
    title: 'Second Blog',
    author: 'Author Two',
    url: 'http://example.com/2',
    likes: 2,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('blog identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  expect(blog.id).toBeDefined()
  expect(blog._id).toBeUndefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'New Author',
    url: 'http://example.com/3',
    likes: 3,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain('New Blog')
})

test('if likes is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'New Author',
    url: 'http://example.com/3'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  const addedBlog = blogsAtEnd.find(b => b.title === 'New Blog')
  expect(addedBlog.likes).toBe(0)
})

test('blog without title or url is not added', async () => {
  const newBlogWithoutTitle = {
    author: 'New Author',
    url: 'http://example.com/3',
    likes: 3,
  }

  const newBlogWithoutUrl = {
    title: 'New Blog',
    author: 'New Author',
    likes: 3,
  }

  await api
    .post('/api/blogs')
    .send(newBlogWithoutTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .send(newBlogWithoutUrl)
    .expect(400)

  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(initialBlogs.length)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1)

  const titles = blogsAtEnd.map(r => r.title)
  expect(titles).not.toContain(blogToDelete.title)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToUpdate = blogsAtStart[0]

  const updatedBlogData = {
    likes: blogToUpdate.likes + 1
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlogData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

  expect(updatedBlog.likes).toBe(blogToUpdate.likes + 1)
})

afterAll(async () => {
  await mongoose.connection.close()
})
