import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
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

    expect(screen.queryByText('http://testurl.com')).toBeNull()
    expect(screen.queryByText('likes 0')).toBeNull()
  })

  it('renders URL, likes, and user information when the button to show details is clicked', () => {
    render(
      <Blog
        blog={blog}
        blogs={[]}
        setBlogs={() => {}}
        user={{ username: 'testuser', name: 'Test User' }}
      />,
    )

    fireEvent.click(screen.getByText('view'))

    expect(screen.getByText('http://testurl.com')).toBeInTheDocument()
    expect(screen.getByText('likes 0')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })
})
