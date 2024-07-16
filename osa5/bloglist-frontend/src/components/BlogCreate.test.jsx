import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { test, expect, vi } from 'vitest'
import BlogForm from './BlogForm'

test('calls createBlog with the right details when a new blog is created', () => {
  const createBlog = vi.fn()

  const newBlog = {
    title: '',
    author: '',
    url: '',
  }

  const handleBlogChange = vi.fn((event) => {
    const { name, value } = event.target
    newBlog[name] = value
  })

  const { container } = render(
    <BlogForm
      addBlog={createBlog}
      newBlog={newBlog}
      handleBlogChange={handleBlogChange}
    />,
  )

  const titleInput = container.querySelector('input[name="title"]')
  const authorInput = container.querySelector('input[name="author"]')
  const urlInput = container.querySelector('input[name="url"]')
  const form = container.querySelector('form')

  fireEvent.change(titleInput, { target: { value: 'test title' } })
  fireEvent.change(authorInput, { target: { value: 'test author' } })
  fireEvent.change(urlInput, { target: { value: 'test url' } })
  fireEvent.submit(form)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith(expect.objectContaining({
    preventDefault: expect.any(Function)
  }))

  // Verify the new blog details
  const submittedEvent = createBlog.mock.calls[0][0]
  submittedEvent.preventDefault()
  expect(newBlog).toEqual({
    title: 'test title',
    author: 'test author',
    url: 'test url',
  })
})
