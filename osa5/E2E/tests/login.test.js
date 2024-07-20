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

      
      test('blogs are ordered according to likes', async ({ page }) => {
        await createBlog(page, 'Blog1', 'Author 1', 'http://1.com')
        await createBlog(page, 'Blog2', 'Author 2', 'http://2.com')
        await createBlog(page, 'Blog3', 'Author 3', 'http://3.com')

        await expect(page.getByText(` a new blog Blog3 by Author 3 added`)).toBeVisible()      

        const blogData = [
          { title: 'Blog1', likes: 3 },
          { title: 'Blog2', likes: 2 },
          { title: 'Blog3', likes: 7 }
        ]

        for (const blog of blogData) {
          const blogElement = page.locator(`text=${blog.title}`)
          await blogElement.getByRole('button', { name: 'view' }).click()

          const likeButton = await page.getByRole('button', { name: 'like' })
          for (let i = 0; i < blog.likes; i++) {
            await likeButton.click()
          }

          await page.getByRole('button', { name: 'hide' }).click()
        }

        await page.waitForTimeout(1000)
        const updatedBlogs = await page.$$('[data-testid="blog"]')

        const likes = await Promise.all(
          updatedBlogs.map(async (blog) => {
            const likesElement = await blog.$('[data-testid="number-of-likes"]')
            const likesText = await likesElement.innerText()
            return parseInt(likesText.trim(), 10)
          })
        )

        function isSortedDescending(array) {
          return array.every((value, index, array) => index === 0 || array[index - 1] >= value)
        }
        expect(isSortedDescending(likes)).toBe(true)
      })
    })
  })
})