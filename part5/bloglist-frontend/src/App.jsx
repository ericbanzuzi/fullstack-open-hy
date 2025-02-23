import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({ message: null, type: '' })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sorted = [...blogs].sort((a, b) => b.likes - a.likes)
      setBlogs( sorted )
    }
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification({ message: 'Wrong username or password', type: 'error' })
      setTimeout(() => {
        setNotification({ message: null, type: '' })
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedUser') // Clear from local storage
  }

  const handleCreate = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        blogService.getAll().then(blogs => {
          const sorted = [...blogs].sort((a, b) => b.likes - a.likes)
          setBlogs( sorted )
        })
        setNotification({ message: `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added!`, type: 'success' })

        setTimeout(() => {
          setNotification({ message: null, type: '' })
        }, 5000)
      }).catch(() => {
        setNotification({ message: 'Failed to create blog', type: 'error' })

        setTimeout(() => {
          setNotification({ message: null, type: '' })
        }, 5000)
      })
  }

  const handleLikes = (id, blogObject) => {
    blogService
      .update(id, blogObject)
      .then(returnedBlog => {
        setBlogs(prevBlogs => {
          const updatedBlogs = prevBlogs.map(blog =>
            blog.id === id ? { ...blog, likes: returnedBlog.likes } : blog
          )
          return [...updatedBlogs].sort((a, b) => b.likes - a.likes)
        })
      })
      .catch(() => {
        setNotification({ message: 'Failed to like blog', type: 'error' })

        setTimeout(() => {
          setNotification({ message: null, type: '' })
        }, 5000)
      })
  }

  const removeBlog = (id) => {
    const blogToRemove = blogs.find(blog => blog.id === id)
    if (window.confirm(`Remove blog "${blogToRemove.title}" by ${blogToRemove.author}?`)) {
      blogService
        .remove(id)
        .then(() => {
          setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogToRemove.id))

          setNotification({ message: `Removed blog "${blogToRemove.title}" by ${blogToRemove.author}`, type: 'success' })

          setTimeout(() => {
            setNotification({ message: null, type: '' })
          }, 5000)
        })
        .catch(() => {
          setNotification({ message: 'Failed to remove blog', type: 'error' })

          setTimeout(() => {
            setNotification({ message: null, type: '' })
          }, 5000)
        })
    }
  }


  const loginForm = () => (
    <div>
      <h2>Login to bloglist</h2>

      <Notification message={notification.message} type={notification.type} />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            data-testid='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            data-testid='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={handleCreate} />
    </Togglable>
  )

  const blogList = () => (
    <div>
      <h2>Blogs</h2>
      <Notification message={notification.message} type={notification.type} />

      <p>Logged in as {user.name} <button type="button" onClick={handleLogout}>logout</button> </p>

      {blogForm()}

      <p></p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={handleLikes} removeBlog={removeBlog}/>
      )}
    </div>
  )


  return (
    <div>
      {user === null ?
        loginForm() :
        blogList()
      }
    </div>
  )
}

export default App