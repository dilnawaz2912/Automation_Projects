import { test, expect } from '@playwright/test';

const LOGIN_URL = 'https://www.saucedemo.com/';
const SELECTORS = {
  username: '#user-name',
  password: '#password',
  loginBtn: '#login-button',
  error: '.error-message-container h3',
  inventoryTitle: '.title',
  inventoryItem: '.inventory_item',
  menuBtn: '#react-burger-menu-btn',
  logoutLink: '#logout_sidebar_link',
};

async function login(page: any, username: string, password: string) {
  await page.fill(SELECTORS.username, username);
  await page.fill(SELECTORS.password, password);
  await page.click(SELECTORS.loginBtn);
}

test.describe('Saucedemo Login Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  test('Happy path - standard_user', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator(SELECTORS.inventoryTitle)).toHaveText('Products');
    const count = await page.locator(SELECTORS.inventoryItem).count();
    expect(count).toBeGreaterThan(0);
  });

  test('Locked out user shows proper error', async ({ page }) => {
    await login(page, 'locked_out_user', 'secret_sauce');
    await expect(page.locator(SELECTORS.error)).toBeVisible();
    await expect(page.locator(SELECTORS.error)).toContainText(/locked out/i);
  });

  test('Problem user - inventory items still render', async ({ page }) => {
    await login(page, 'problem_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
    const count = await page.locator(SELECTORS.inventoryItem).count();
    expect(count).toBeGreaterThan(0);
  });

  test('Performance glitch user - page eventually loads', async ({ page }) => {
    const start = Date.now();
    await login(page, 'performance_glitch_user', 'secret_sauce');
    await page.waitForSelector(SELECTORS.inventoryItem, { timeout: 20000 });
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(20000);
    await expect(page.locator(SELECTORS.inventoryTitle)).toHaveText('Products');
  });

  test('Invalid credentials show error', async ({ page }) => {
    await login(page, 'bad_user', 'wrong_password');
    await expect(page.locator(SELECTORS.error)).toBeVisible();
    await expect(page.locator(SELECTORS.error)).toContainText(/do not match any user/i);
  });

  test('Empty username shows validation error', async ({ page }) => {
    await page.fill(SELECTORS.username, '');
    await page.fill(SELECTORS.password, 'secret_sauce');
    await page.click(SELECTORS.loginBtn);
    await expect(page.locator(SELECTORS.error)).toBeVisible();
    await expect(page.locator(SELECTORS.error)).toContainText(/username is required/i);
  });

  test('Empty password shows validation error', async ({ page }) => {
    await page.fill(SELECTORS.username, 'standard_user');
    await page.fill(SELECTORS.password, '');
    await page.click(SELECTORS.loginBtn);
    await expect(page.locator(SELECTORS.error)).toBeVisible();
    await expect(page.locator(SELECTORS.error)).toContainText(/password is required/i);
  });

  test('Logout flow returns to login page', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
    await page.click(SELECTORS.menuBtn);
    await page.click(SELECTORS.logoutLink);
    await expect(page).toHaveURL(LOGIN_URL);
    await expect(page.locator(SELECTORS.loginBtn)).toBeVisible();
  });

  test('Session isolation - fresh state between tests', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveURL(LOGIN_URL);
  });
});
