import playwright from 'playwright';
import { test, expect } from 'playwright/test';

let page: playwright.Page;

test.describe('Register form', async () => {
  test.beforeAll(async () => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  });

  test('The user is not registered in the site', async ({ page }) => {
    const username: string = 'pablo';
    const password: string = 'pabloasw';

    await expect(page.locator('#register-button')).toBeVisible();
    await page.click('#register-button');

    await page.fill('#username', username);
    await page.fill('#password', password);
    await page.click('#submit-button');

    await expect(page.locator('#confirmation-message')).toHaveText('User added successfully');
  });

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async () => {

  });
});