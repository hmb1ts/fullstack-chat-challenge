import { test, expect } from '@playwright/test';

test.describe('Chat Cross-App E2E', () => {
  test('should exchange messages between React and Vue frontends', async ({ browser }) => {
    // 1. Create two separate browser contexts
    const reactContext = await browser.newContext();
    const vueContext = await browser.newContext();

    const reactPage = await reactContext.newPage();
    const vuePage = await vueContext.newPage();

    // 2. Open both apps
    // We assume servers are running on 5173 and 5174
    await reactPage.goto('http://localhost:5173');
    await vuePage.goto('http://localhost:5174');

    // 3. Login on React
    await reactPage.fill('input[placeholder*="Username"]', 'ReactUser');
    await reactPage.click('button:has-text("Join Chat")');
    await expect(reactPage.locator('text=Connected')).toBeVisible();

    // 4. Login on Vue
    await vuePage.fill('input[placeholder*="Username"]', 'VueUser');
    await vuePage.click('button:has-text("Join Chat")');
    await expect(vuePage.locator('text=Connected')).toBeVisible();

    // 5. React sends a message
    const reactInput = reactPage.locator('input[placeholder*="Type a message"]');
    await reactInput.fill('Hello from React!');
    await reactPage.keyboard.press('Enter');

    // 6. Vue receives the message
    await expect(vuePage.locator('text=ReactUser: Hello from React!')).toBeVisible();

    // 7. Vue sends a message back
    const vueInput = vuePage.locator('input[placeholder*="Type a message"]');
    await vueInput.fill('Hello from Vue!');
    await vuePage.keyboard.press('Enter');

    // 8. React receives the message
    await expect(reactPage.locator('text=VueUser: Hello from Vue!')).toBeVisible();

    // 9. Test Typing Indicator (React starts typing)
    await reactInput.fill('Typing...');
    // Should show in Vue
    await expect(vuePage.locator('.typing-indicator')).toBeVisible();
    await expect(vuePage.locator('text=ReactUser is typing')).toBeVisible();

    // 10. Stop typing
    await reactPage.keyboard.press('Enter'); // Sends message and stops typing
    await expect(vuePage.locator('.typing-indicator')).not.toBeVisible();

    await reactContext.close();
    await vueContext.close();
  });
});
