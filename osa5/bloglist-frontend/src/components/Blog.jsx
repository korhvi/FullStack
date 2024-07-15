import React, { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, blogs, setBlogs }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const likeBlog = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user ? blog.user.id : null
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map(b => (b.id !== blog.id ? b : returnedBlog)))
    } catch (exception) {
      console.error('Failed to like the blog', exception)
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleDetails}>{showDetails ? 'hide' : 'view'}</button>
      </div>
      {showDetails && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button onClick={likeBlog}>like</button>
          </div>
          {blog.user && <div>{blog.user.name}</div>}
        </div>
      )}
    </div>
  )
}

export default Blog
