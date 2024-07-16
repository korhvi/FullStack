import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, beforeEach } from 'vitest'
import Blog from './Blog'

describe('<Blog />', () => {
  let blog

  beforeEach(() => {
    blog = {
      id: '67890',
      title: 'Testi Blogi Otsikko',
      author: 'Testi Kirjoittaja',
      url: 'http://testiurl.fi',
      likes: 10,
      user: {
        username: 'testikäyttäjä',
        name: 'Testi Käyttäjä',
      },
    }
  })

  test('shows url, likes and user when the view button is clicked', () => {
    render(
      <Blog
        blog={blog}
        blogs={[]}
        setBlogs={() => {}}
        user={{ username: 'testikäyttäjä', name: 'Testi Käyttäjä' }}
      />,
    )

    expect(screen.queryByText('http://testiurl.fi')).toBeNull()
    expect(screen.queryByText('likes 10')).toBeNull()
    expect(screen.queryByText('Testi Käyttäjä')).toBeNull()

    const button = screen.getByText('view')
    fireEvent.click(button)

    expect(screen.getByText('http://testiurl.fi')).toBeInTheDocument()
    expect(screen.getByText('likes 10')).toBeInTheDocument()
    expect(screen.getByText('Testi Käyttäjä')).toBeInTheDocument()
  })
})
