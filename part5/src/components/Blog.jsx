import { useState, forwardRef, useImperativeHandle } from 'react'

const Blog = ({ blog }) => {

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

  const defaultView = () => {
    return (
      <div>
        {blog.title} {blog.author} <button onClick={toggleDetails}> View</button>
      </div>
    )
  }

  const extendedView = () => {
    return (
      <div>
        <div>{blog.title} {blog.author} <button onClick={toggleDetails}> Hide</button> </div>
        <div>{blog.url} </div>
        <div>likes {blog.likes} <button> like</button> </div>
        <div>{blog.user.name} </div>
      </div>
    )
  }

  return (
  <div style={blogStyle}>
    {extended?
        extendedView() :
        defaultView()
      }
  </div>  
)}

export default Blog