import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import Blog from './Blog'

describe('<Blog />', () => {
  let blog

  beforeEach(() => {
    blog = {
      id: '12345',
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'http://testurl.com',
      likes: 0,
      user: {
        username: 'testuser',
        name: 'Test User',
      },
    }
  })

  it('renders title but does not render URL or likes by default', () => {
    render(
      <Blog
        blog={blog}
        blogs={[]}
        setBlogs={() => {}}
        user={{ username: 'testuser', name: 'Test User' }}
      />,
    )

    const titleElement = screen.getByText((content, element) => {
      return (
        element.tagName.toLowerCase() === 'div' &&
        content.includes('Test Blog Title')
      )
    })
    expect(titleElement).toBeInTheDocument()

    const urlElement = screen.queryByText('http://testurl.com')
    expect(urlElement).toBeNull()

    const likesElement = screen.queryByText('likes 0')
    expect(likesElement).toBeNull()
  })
})
