const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')

describe('API test with initial dummy database', () => {
    
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.blogs)
    })

    describe('Viewing blogs via GET', () => {
        test('blogs are returned as json', async () => {
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })
    
        test('all blogs are returned', async () => {
            const response = await api.get('/api/blogs')
            assert.strictEqual(response.body.length, helper.blogs.length)
        })
    
        test('unique identifier property of the blog posts is named id', async () => {
            const response = await api.get('/api/blogs')        
            response.body.forEach(blog => {
                assert(blog.id)
            })
        })
    })

    describe('Viewing a specific blog via GET', () => {
    
        test('succeeds with a valid id', async () => {
          const blogsAtStart = await helper.blogsInDb()
          const blogToView = blogsAtStart[0]
          const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
          assert.deepStrictEqual(resultBlog.body, blogToView)
        })
    
        test('fails with statuscode 404 if note does not exist', async () => {
          const validNonexistingId = await helper.nonExistingId()
          
          await api
            .get(`/api/blogs/${validNonexistingId}`)
            .expect(404)
        })
    
        test('fails with statuscode 400 id is invalid', async () => {
          const invalidId = '5a3d5da59070081a82a3445'
          await api
            .get(`/api/blogs/${invalidId}`)
            .expect(400)
        })
    })

    describe('Creating new blogs via POST', () => {
        test('succeeds with a valid blog', async () => {
            const newBlog = {
                title: 'async/await simplifies making async calls',
                auhtor: 'Eric Banzuzi',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
                likes: 6
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.blogs.length + 1)
    
            const titles = blogsAtEnd.map(n => n.title)
            assert(titles.includes('async/await simplifies making async calls'))
        })

        test('if the likes property is missing, it will default to the value 0', async () => {
            const newBlog = {
                title: 'test likes property',
                auhtor: 'Joe Doe',
                url: 'https://dummy.likes.com'
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            
            const blogsAtEnd = await helper.blogsInDb()
            const addedBlog = blogsAtEnd.find(blog => blog.title === 'test likes property')
            assert.strictEqual(addedBlog.likes, 0)
        })

        test('responds with status code 400 Bad Request if the title and url properties are missing', async () => {
            const newBlog = {
                author: 'Timothee Chalamet',
                likes: 14
            }

             await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
            
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.blogs.length)
        })
    })

    describe('Deleting a blog via DELETE', () => {
        test('succeeds with status code 204 if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]
    
            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)
    
            const blogsAtEnd = await helper.blogsInDb()
    
            assert.strictEqual(blogsAtEnd.length, helper.blogs.length - 1)
    
            const titles = blogsAtEnd.map(blog => blog.title)
            assert(!titles.includes(blogToDelete.title))
        })
    })
    
    describe('Updating a blog via PUT', () => {
        test('succeeds with a valid blog', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = blogsAtStart[0]
            const updatedBlog = {
                title: 'Updated blog title',
                auhtor: blogToUpdate.author,
                url: blogToUpdate.url,
                likes: blogToUpdate.likes
            }

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(updatedBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/)
            
            const blogsAtEnd = await helper.blogsInDb()
            const updatedBlogAtEnd = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
            assert.deepStrictEqual(updatedBlog, 
                {
                    title: updatedBlogAtEnd.title,
                    auhtor: updatedBlogAtEnd.author,
                    url: updatedBlogAtEnd.url,
                    likes: updatedBlogAtEnd.likes
                }
            )
        })
    })
})

after(() => {
    mongoose.connection.close()
})