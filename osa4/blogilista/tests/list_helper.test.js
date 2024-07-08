const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]
  
    const listWithMultipleBlogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Blog Post 2',
        author: 'Author 2',
        url: 'http://example.com/blog2',
        likes: 10,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17fa',
        title: 'Blog Post 3',
        author: 'Author 3',
        url: 'http://example.com/blog3',
        likes: 0,
        __v: 0
      }
    ]

    test('of empty list is zero', () => {
        const result = listHelper.totalLikes([])
        assert.strictEqual(result, 0)
      })
  
    test('when list has only one blog equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      assert.strictEqual(result, 5)
    })

    test('of a bigger list is calculated right', () => {
      const result = listHelper.totalLikes(listWithMultipleBlogs)
      assert.strictEqual(result, 15)
    })
  })

describe('favorite blog', () => {
    const listWithMultipleBlogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Blog Post 2',
        author: 'Author 2',
        url: 'http://example.com/blog2',
        likes: 10,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17fa',
        title: 'Blog Post 3',
        author: 'Author 3',
        url: 'http://example.com/blog3',
        likes: 0,
        __v: 0
      }
    ]
  
    test('finds the blog with the most likes', () => {
      const result = listHelper.favoriteBlog(listWithMultipleBlogs)
      assert.deepStrictEqual(result, {
        title: 'Blog Post 2',
        author: 'Author 2',
        likes: 10
      })
    })
  })
  
describe('most blogs', () => {
    const listWithMultipleBlogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Blog Post 2',
        author: 'Author 2',
        url: 'http://example.com/blog2',
        likes: 10,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17fa',
        title: 'Blog Post 3',
        author: 'Author 3',
        url: 'http://example.com/blog3',
        likes: 0,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17fb',
        title: 'Blog Post 4',
        author: 'Author 2',
        url: 'http://example.com/blog4',
        likes: 7,
        __v: 0
      }
    ]
  
    test('finds the author with the most blogs', () => {
      const result = listHelper.mostBlogs(listWithMultipleBlogs)
      assert.deepStrictEqual(result, {
        author: 'Author 2',
        blogs: 2
      })
    })
  })

describe('most likes', () => {
    const listWithMultipleBlogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Blog Post 2',
        author: 'Author 2',
        url: 'http://example.com/blog2',
        likes: 10,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17fa',
        title: 'Blog Post 3',
        author: 'Author 3',
        url: 'http://example.com/blog3',
        likes: 0,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17fb',
        title: 'Blog Post 4',
        author: 'Author 2',
        url: 'http://example.com/blog4',
        likes: 7,
        __v: 0
      }
    ]
  
    test('finds the author with the most likes', () => {
      const result = listHelper.mostLikes(listWithMultipleBlogs)
      assert.deepStrictEqual(result, {
        author: 'Author 2',
        likes: 17
      })
    })
  })
