const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Testi Testinen',
        username: 'testausta',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const usernameField = page.getByTestId('username')
    const passwordField = page.getByTestId('password')
    
    await expect(usernameField).toBeVisible()
    await expect(passwordField).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testausta', 'salainen')    
      await expect(page.getByText('Testi Testinen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testausta', 'wrongpassword')
      await expect(page.getByText('Wrong username or password')).toBeVisible()
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'testausta', 'salainen')
      })
  
      test('a new blog can be created', async ({ page }) => {
        const title = 'Test Blog'
        const author = 'Test Author'
        const url = 'http://Test.com'
  
        await createBlog(page, title, author, url)
  
        await expect(page.getByText(`${title} ${author}`)).toBeVisible()      
      })
      test('a blog can be liked', async ({ page }) => {
        const title = 'Testi Blog'
        const author = 'Testi Author'
        const url = 'http://Test.com'
  
        await createBlog(page, title, author, url)

        const blogElement = page.locator(`text=${title} ${author}`)

        await blogElement.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()

        await expect(page.getByText('likes 1')).toBeVisible()
      })
    })
  })
})