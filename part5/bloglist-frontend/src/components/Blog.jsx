import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, removeBlog }) => {

  const [extended, setExtended] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetails = () => {
    setExtended(!extended)
  }

  const blogLike = (event) => {
    event.preventDefault()

    const updatedBlog = {
      ...blog,
      user: blog.user._id,
      likes: blog.likes + 1
    }

    updateBlog(blog.id, updatedBlog)
  }

  const blogRemove = (event) => {
    event.preventDefault()
    removeBlog(blog.id)
  }

  const loggedUserJSON = window.localStorage.getItem('loggedUser')
  const user = loggedUserJSON ? JSON.parse(loggedUserJSON) : null

  const defaultView = () => {
    return (
      <div className='defaultBlog'>
        <div className='header'>
          {blog.title} {blog.author} <button onClick={toggleDetails}> View</button>
        </div>
      </div>
    )
  }

  const extendedView = () => {
    return (
      <div className='extendedBlog'>
        <div className='header'> {blog.title} {blog.author} <button onClick={toggleDetails}> Hide</button> </div>
        <div className='url'> {blog.url} </div>
        <div className='likes'> likes {blog.likes} <button onClick={blogLike}> like</button> </div>
        <div className='user'> {blog.user.name} </div>
        {user && user.username === blog.user.username && user.name === blog.user.name ?
          <div> <button onClick={blogRemove}> remove</button> </div> :
          null
        }
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      { extended ? extendedView() : defaultView() }
    </div>
  )}


// Blog.propTypes = {
//   blog: PropTypes.object.isRequired,
//   updateBlog: PropTypes.func.isRequired,
//   removeBlog: PropTypes.func.isRequired
// }

export default Blog