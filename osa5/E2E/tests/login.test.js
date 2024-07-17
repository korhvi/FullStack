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
  })
})