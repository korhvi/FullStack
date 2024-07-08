const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const favorite = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorCount = _.countBy(blogs, 'author')
  const maxAuthor = _.maxBy(Object.keys(authorCount), (author) => authorCount[author])

  return {
    author: maxAuthor,
    blogs: authorCount[maxAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authorLikes = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})

  const maxAuthor = _.maxBy(Object.keys(authorLikes), (author) => authorLikes[author])

  return {
    author: maxAuthor,
    likes: authorLikes[maxAuthor]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
