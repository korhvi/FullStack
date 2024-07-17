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

    await page.goto('/');
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = page.locator('form')
    await expect(loginForm).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('testausta')
      await page.locator('input[name="Password"]').fill('salainen')
      await page.locator('button[type="submit"]').click()
      await expect(page.locator('text=Testi Testinen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('testausta')
      await page.locator('input[name="Password"]').fill('vääräsalasana')
      await page.locator('button[type="submit"]').click()
      await expect(page.locator('text=wrong username or password')).toBeVisible()
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'testausta', 'salainen')
        await expect(page.locator('text=Testi Testinen logged in')).toBeVisible()
      })

      test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'Test Blog Title', 'Test Author', 'http://testblog.com')
        await expect(page.locator('text=a new blog Test Blog Title by Test Author added')).toBeVisible()
      })
    })
  })
})
