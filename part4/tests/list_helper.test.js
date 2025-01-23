const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { listWithOneBlog, blogs } = require('./test_helper')

describe('dummy', () => {
    test('dummy returns one', () => {
        const result = listHelper.dummy([])
        assert.strictEqual(result, 1)
    })
})

describe('total likes', () => {
      
    test('when list is empty, equals zero', () => {
        assert.strictEqual(listHelper.totalLikes([]), 0)
    })
    
    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      assert.strictEqual(result, 5)
    })

    test('when list has many blogs, equals the sum of likes', () => {
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 7+5+12+10+0+2)
    })
  })

describe('favoriteBlog', () => {
    test('find the favorite when list has many blogs, equals the one with most likes', () => {
        const result = listHelper.favoriteBlog(blogs)

        assert.deepStrictEqual(result, 
            {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                likes: 12
            }
        )
    })

    test('find the favorite when list one blog, equals the only one ', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        assert.deepStrictEqual(result, 
            {
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                likes: 5
            }
        )
    })

    test('find the favorite when list is empty, equals null', () => {
        const result = listHelper.favoriteBlog([])
        assert.strictEqual(result, null)
    })
})

describe('mostBlogs', () => {
    test('find the author with most blogs when list has many blogs', () => {
        const result = listHelper.mostBlogs(blogs)
        assert.deepStrictEqual(result, 
            {   
                author: "Robert C. Martin",
                blogs: 3
            }
        )
    })

    test('find the author with most blogs when list has one blog', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        assert.deepStrictEqual(result, 
            {
                author: "Edsger W. Dijkstra",
                blogs: 1
            }
        )
    })

    test('find the author with most blogs when list is empty', () => {
        const result = listHelper.mostBlogs([])
        assert.strictEqual(result, null)
    })
})

describe('mostLikes', () => {
    test('find the author with most likes when list has many blogs', () => {
        const result = listHelper.mostLikes(blogs)
        assert.deepStrictEqual(result, 
            {
                author: "Edsger W. Dijkstra",
                likes: 17
            }
        )
    })

    test('find the author with most likes when list has one blog', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        assert.deepStrictEqual(result, 
            {
                author: "Edsger W. Dijkstra",
                likes: 5
            }
        )
    })

    test('find the author with most likes when list is empty', () => {
        const result = listHelper.mostLikes([])
        assert.strictEqual(result, null)
    })
})
