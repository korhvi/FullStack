const { test, expect, beforeEach, describe } = require('@playwright/test')

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

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = page.locator('form')
    await expect(loginForm).toBeVisible()
  })
  
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.waitForSelector('input[name="Username"]')
      await page.locator('input[name="Username"]').fill('testausta')

      await page.waitForSelector('input[name="Password"]')
      await page.locator('input[name="Password"]').fill('salainen')

      await page.locator('button[type="submit"]').click()
      await expect(page.locator('text=Testi Testinen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.waitForSelector('input[name="Username"]')
      await page.locator('input[name="Username"]').fill('testausta')

      await page.waitForSelector('input[name="Password"]')
      await page.locator('input[name="Password"]').fill('vääräsalasana')
      
      await page.locator('button[type="submit"]').click()
      await expect(page.locator('text=wrong username or password')).toBeVisible()
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await page.fill('input[name="Username"]', 'testausta')
        await page.fill('input[name="Password"]', 'salainen')
        await page.click('button[type="submit"]')
        await expect(page.locator('text=Testi Testinen logged in')).toBeVisible()
      })

      test('a new blog can be created', async ({ page }) => {
        await page.click('button:has-text("create new blog")')
        await page.fill('input[name="title"]', 'Test Blog Title')
        await page.fill('input[name="author"]', 'Test Author')
        await page.fill('input[name="url"]', 'http://testblog.com')
        await page.click('button[type="submit"]:has-text("create")')
        await expect(page.locator('text=a new blog Test Blog Title by Test Author added')).toBeVisible()
      })
    })
  })
})