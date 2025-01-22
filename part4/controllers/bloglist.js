const bloglistRouter = require('express').Router()
const Blog = require('../models/blog')

bloglistRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

bloglistRouter.post('/', (request, response, next) => {
  const blog = new Blog(request.body)
  console.log(blog)
  blog.save().then(result => {
      response.status(201).json(result)
  })
})

module.exports = bloglistRouter  // Exports the router to be available for all consumers of the module