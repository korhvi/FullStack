const loginWith = async (page, username, password) => {
  await page.locator('text=log in').click()
  await page.locator('input[name="Username"]').fill(username)
  await page.locator('input[name="Password"]').fill(password)
  await page.locator('button[type="submit"]').click()
}

const createBlog = async (page, title, author, url) => {
  await page.locator('text=create new blog').click()
  await page.locator('input[name="title"]').fill(title)
  await page.locator('input[name="author"]').fill(author)
  await page.locator('input[name="url"]').fill(url)
  await page.locator('button[type="submit"]').click()
}

export { loginWith, createBlog }
