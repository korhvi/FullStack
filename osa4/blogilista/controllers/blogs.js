const express = require('express')
const Blog = require('../models/blog')
const blogsRouter = express.Router()

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'something went wrong' })
  }
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body

  if (!title || !url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
  })

  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'something went wrong' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const blog = await Blog.findByIdAndDelete(request.params.id)
    if (blog) {
      response.status(204).end()
    } else {
      response.status(404).json({ error: 'blog not found' })
    }
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'something went wrong' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  const blog = {
    likes
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).json({ error: 'blog not found' })
    }
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'something went wrong' })
  }
})

module.exports = blogsRouter
