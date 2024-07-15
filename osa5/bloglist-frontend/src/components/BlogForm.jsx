import React from 'react'

const BlogForm = ({
  addBlog,
  newBlog,
  handleBlogChange
}) => {
  return (
    <form onSubmit={addBlog}>
      <div>
        title
        <input
          type="text"
          name="title"
          value={newBlog.title}
          onChange={handleBlogChange}
        />
      </div>
      <div>
        author
        <input
          type="text"
          name="author"
          value={newBlog.author}
          onChange={handleBlogChange}
        />
      </div>
      <div>
        url
        <input
          type="text"
          name="url"
          value={newBlog.url}
          onChange={handleBlogChange}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm
