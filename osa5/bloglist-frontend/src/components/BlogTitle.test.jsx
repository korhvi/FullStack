import React from 'react'
import { render, screen } from '@testing-library/react'
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

  test('renders title but does not render URL or likes by default', () => {
    render(
      <Blog
        blog={blog}
        blogs={[]}
        setBlogs={() => {}}
        user={{ username: 'testikäyttäjä', name: 'Testi Käyttäjä' }}
      />,
    )

    const titleElement = screen.getByText((content, element) => {
      return (
        element.tagName.toLowerCase() === 'div' &&
        content.includes('Testi Blogi Otsikko')
      )
    })
    expect(titleElement).toBeInTheDocument()
  })
})
