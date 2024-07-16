import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import Blog from './Blog'

describe('<Blog />', () => {
  let blog
  let mockHandler

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

    mockHandler = vi.fn()
  })

  test('calls the like button event handler twice when the like button is clicked twice', () => {
    render(
      <Blog
        blog={blog}
        user={{ username: 'testikäyttäjä', name: 'Testi Käyttäjä' }}
        handleLike={mockHandler}
        blogs={[]}
        setBlogs={() => {}}
      />,
    )

    // Klikkaa "view"-nappia näyttääksesi kaikki tiedot
    const viewButton = screen.getByText('view')
    fireEvent.click(viewButton)

    // Klikkaa "like"-nappia kahdesti
    const likeButton = screen.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    // Varmista, että tapahtumankäsittelijäfunktiota kutsutaan kahdesti
    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})
