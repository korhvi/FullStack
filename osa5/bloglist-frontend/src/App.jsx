import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
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
    } catch (exception) {      
      setErrorMessage('wrong credentials')      
      setTimeout(() => {        
        setErrorMessage(null)     
      }, 5000)    
    } 
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
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
    } catch (exception) {
      setErrorMessage('Failed to add blog')
      setTimeout(() => {
        setErrorMessage(null)
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
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
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
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
