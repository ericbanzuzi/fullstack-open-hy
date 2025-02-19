const { test, expect, beforeEach, describe } = require('@playwright/test')
import { loginWith, createBlog } from './helper'

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Eric Banzuzi',
        username: 'ebanzuzi',
        password: 'password'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Login to bloglist')
    await expect(locator).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'ebanzuzi', 'password')
      await page.pause()
      await expect(page.getByText('Logged in as Eric Banzuzi')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'ebanzuzi', 'salainen')
      await page.pause()
      
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'ebanzuzi', 'password')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright', 'Eric Banzuzi', 'https://testblog.com')
      const successDiv = await page.locator('.success')
      await expect(successDiv).toContainText('A new blog "a blog created by playwright" by Eric Banzuzi added!')
      await expect(successDiv).toHaveCSS('border-style', 'solid')
      await expect(successDiv).toHaveCSS('color', 'rgb(0, 128, 0)')

      await expect(page.getByText('a blog created by playwright Eric Banzuzi')).toBeVisible()
    })

    describe('when a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'a blog created by playwright', 'Eric Banzuzi', 'https://testblog.com')
      })
  
      test('blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'View' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(await page.getByText('likes 1')).toBeVisible()
      })

      test('blog can be deleted', async ({ page }) => {
        await page.getByRole('button', { name: 'View' }).click()
        
        page.once('dialog', async (dialog) => {
          expect(dialog.type()).toBe('confirm')
          expect(dialog.message()).toContain('Remove blog "a blog created by playwright" by Eric Banzuzi?')
          await dialog.accept()
        })

        await page.getByRole('button', { name: 'remove' }).click()

        const successDiv = await page.locator('.success')
        await expect(successDiv).toContainText('Removed blog "a blog created by playwright" by Eric Banzuzi')
        await expect(successDiv).toHaveCSS('border-style', 'solid')
        await expect(successDiv).toHaveCSS('color', 'rgb(0, 128, 0)')

        await expect(await page.getByText('a blog created by playwright Eric Banzuzi')).not.toBeVisible()
      })

      test('only user who added the blog sees the blog\'s delete button', async ({ page, request }) => {
        await page.getByRole('button', { name: 'View' }).click()
        await expect(await page.getByText('remove')).toBeVisible()
        
        await page.getByRole('button', { name: 'logout' }).click()

        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'New User',
            username: 'mluukkai',
            password: 'salainen'
          }
        })

        loginWith(page, 'mluukkai', 'salainen')

        await expect(await page.getByText('a blog created by playwright Eric Banzuzi')).not.toBeVisible()
        await page.getByRole('button', { name: 'View' }).click()
        await expect(await page.getByText('remove')).not.toBeVisible()
      })
    })
    
  })

})