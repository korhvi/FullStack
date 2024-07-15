import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({ text: null, type: null })
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => {
        setBlogs(blogs)
      })
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage({
        text: 'Successfully logged in!',
        type: 'success'
      })
      setTimeout(() => {
        setMessage({ text: null, type: null })
      }, 5000)
    } catch (error) {
      setMessage({
        text: 'Wrong username or password',
        type: 'error'
      })
      setTimeout(() => {
        setMessage({ text: null, type: null })
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
    setMessage({
      text: 'Successfully logged out',
      type: 'success'
    })
    setTimeout(() => {
      setMessage({ text: null, type: null })
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
        type: 'success'
      })
      setTimeout(() => {
        setMessage({ text: null, type: null })
      }, 5000)
    } catch (exception) {
      setMessage({
        text: 'Failed to add blog',
        type: 'error'
      })
      setTimeout(() => {
        setMessage({ text: null, type: null })
      }, 5000)
    }
  }

  const handleBlogChange = ({ target }) => {
    const { name, value } = target
    setNewBlog({ ...newBlog, [name]: value })
  }

  if (user === null) {
    return (
      <div>
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
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <BlogForm
        addBlog={addBlog}
        newBlog={newBlog}
        handleBlogChange={handleBlogChange}
      />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
