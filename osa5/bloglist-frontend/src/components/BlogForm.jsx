import React from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ addBlog, newBlog, handleBlogChange }) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    addBlog(event)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        title:
        <input
          type="text"
          value={newBlog.title}
          name="title"
          data-testid="title"
          onChange={handleBlogChange}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={newBlog.author}
          name="author"
          data-testid="author"
          onChange={handleBlogChange}
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={newBlog.url}
          name="url"
          data-testid="url"
          onChange={handleBlogChange}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired,
  newBlog: PropTypes.object.isRequired,
  handleBlogChange: PropTypes.func.isRequired,
}

export default BlogForm
