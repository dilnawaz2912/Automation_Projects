import { test, expect } from '@playwright/test';

const LOGIN_URL = 'https://www.saucedemo.com/';

test.describe('Seed', () => {
  test('Navigate to Saucedemo login page', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await expect(page).toHaveURL(/saucedemo\.com/);
    await expect(page.locator('#login-button')).toBeVisible();
    await expect(page.locator('#user-name')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });
});
