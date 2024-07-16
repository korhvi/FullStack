import React from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ addBlog, newBlog, handleBlogChange }) => (
  <form onSubmit={addBlog}>
    <div>
      title:
      <input
        type="text"
        value={newBlog.title}
        name="title"
        onChange={handleBlogChange}
      />
    </div>
    <div>
      author:
      <input
        type="text"
        value={newBlog.author}
        name="author"
        onChange={handleBlogChange}
      />
    </div>
    <div>
      url:
      <input
        type="text"
        value={newBlog.url}
        name="url"
        onChange={handleBlogChange}
      />
    </div>
    <button type="submit">create</button>
  </form>
)

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired,
  newBlog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  handleBlogChange: PropTypes.func.isRequired,
}

export default BlogForm
