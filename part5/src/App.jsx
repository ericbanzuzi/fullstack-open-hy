import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({ message: null, type: "" });
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('') 
  const [url, setUrl] = useState('') 

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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
        setNotification({ message: "Wrong username or password", type: "error" })
        setTimeout(() => {
          setNotification({ message: null, type: "" })
        }, 5000)
      }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedUser') // Clear from local storage
  }

  const handleCreate = (event) => {
    event.preventDefault()

    const blogObject = {
      title: title,
      author: author,
      url: url
    }
      
    blogService
      .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setTitle('')
        setAuthor('')
        setUrl('')

        setNotification({ message: `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added!`, type: "success" })

        setTimeout(() => {
          setNotification({ message: null, type: "" })
        }, 5000)
  }).catch(() => {
    setNotification({ message: "Failed to create blog", type: "error" })

    setTimeout(() => {
      setNotification({ message: null, type: "" })
    }, 5000)
  })

  }

  const loginForm = () => (
    <div>
      <h2>Login to bloglist</h2>

      <Notification message={notification.message} type={notification.type} />
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
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

  const blogList = () => (
    <div>
      <h2>Blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      
      <p>Logged in as {user.name} <button type="button" onClick={handleLogout}>logout</button> </p>

      <h2>Create new blog</h2>
      <form onSubmit={handleCreate}>
        <div>
          title:
            <input type="text" value={title} name="Title" onChange={({ target }) => setTitle(target.value)}/>
        </div>
        <div>
          author:
          <input type="text" value={author} name="Author" onChange={({ target }) => setAuthor(target.value)}/>
        </div>
        <div>
          url:
          <input type="text" value={url} name="Url" onChange={({ target }) => setUrl(target.value)}/>
        </div>
        <button type="submit">create</button>
      </form>

      <p></p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
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