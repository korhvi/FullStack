import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({ text: null, type: '' })
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs)
    })
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage({
        text: 'Successfully logged in!',
        type: 'success',
      })
      setTimeout(() => {
        setMessage({ text: null, type: '' })
      }, 5000)
    } catch (error) {
      setMessage({
        text: 'Wrong username or password',
        type: 'error',
      })
      setTimeout(() => {
        setMessage({ text: null, type: '' })
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
    setMessage({
      text: 'Successfully logged out',
      type: 'success',
    })
    setTimeout(() => {
      setMessage({ text: null, type: '' })
    }, 5000)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    }

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNewBlog({ title: '', author: '', url: '' })
      setMessage({
        text: `a new blog ${blogObject.title} by ${blogObject.author} added`,
        type: 'success',
      })
      setTimeout(() => {
        setMessage({ text: null, type: '' })
      }, 5000)
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      setMessage({
        text: 'Failed to add blog',
        type: 'error',
      })
      setTimeout(() => {
        setMessage({ text: null, type: '' })
      }, 5000)
    }
  }

  const handleBlogChange = ({ target }) => {
    const { name, value } = target
    setNewBlog({ ...newBlog, [name]: value })
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map((b) => (b.id !== blog.id ? b : returnedBlog)))
    } catch (exception) {
      console.error('Failed to like the blog', exception)
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={message.text} type={message.type} />
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message.text} type={message.type} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm
          addBlog={addBlog}
          newBlog={newBlog}
          handleBlogChange={handleBlogChange}
        />
      </Togglable>
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          blogs={blogs}
          setBlogs={setBlogs}
          handleLike={() => handleLike(blog)}
        />
      ))}
    </div>
  )
}

export default App
