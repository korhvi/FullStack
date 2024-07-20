const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Testi Testinen',
        username: 'testausta',
        password: 'salainen'
      }
    })

    await page.goto('/')
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

      test('a blog can be deleted by the user who added it', async ({ page }) => {
        const title = 'Poista Blog'
        const author = 'Poista Author'
        const url = 'http://Poista.com'

        await createBlog(page, title, author, url)

        const blogElement = page.locator(`text=${title} ${author}`)

        await blogElement.getByRole('button', { name: 'view' }).click()

        page.on('dialog', async dialog => {
          expect(dialog.message()).toContain(`Remove blog ${title} by ${author}?`)
          await dialog.accept()
        })

        await page.getByRole('button', { name: 'delete' }).click()
        
        await expect(blogElement).not.toBeVisible()
      })

      test('only the user who added a blog sees the delete button', async ({ page, request }) => {
        const title = 'Näkyvä Blog'
        const author = 'Näkyvä Author'
        const url = 'http://Näkyvä.com'

        await createBlog(page, title, author, url)

        const blogElement = page.locator(`text=${title} ${author}`)

        await blogElement.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()

        await page.getByRole('button', { name: 'logout' }).click()
        await request.post('/api/users', {
          data: {
            name: 'Toinen Testi',
            username: 'Test',
            password: 'salainen'
          }
        })

        await loginWith(page, 'Test', 'salainen')
        await blogElement.getByRole('button', { name: 'view' }).click()

        await expect(blogElement.getByRole('button', { name: 'delete' })).not.toBeVisible()
      })
    })
  })
})