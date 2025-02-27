import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')
  
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vite \+ React/)
})

test('has Vite and React logos', async ({ page }) => {
  await page.goto('/')
  
  // Find the Vite logo
  const viteLogo = page.getByAltText('vite logo')
  await expect(viteLogo).toBeVisible()
  
  // Find the React logo
  const reactLogo = page.getByAltText('react logo')
  await expect(reactLogo).toBeVisible()
})
