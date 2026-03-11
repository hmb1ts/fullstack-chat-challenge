import { test, expect, Browser } from '@playwright/test';

test.describe('Chat Cross-App E2E', () => {
  test('should exchange messages between React and Vue frontends', async ({ browser }) => {
    // 1. Create two separate browser contexts
    const reactContext = await browser.newContext();
    const vueContext = await browser.newContext();

    const reactPage = await reactContext.newPage();
    const vuePage = await vueContext.newPage();

    // 2. Open both apps (assuming ports 5173 and 5174)
    await reactPage.goto('http://localhost:5173');
    await vuePage.goto('http://localhost:5174');

    // 3. Login on React
    await reactPage.fill('input[placeholder*="nombre"]', 'ReactUser');
    await reactPage.click('button:has-text("Entrar")');
    await expect(reactPage.locator('text=Conectado')).toBeVisible();

    // 4. Login on Vue
    await vuePage.fill('input[placeholder*="nombre"]', 'VueUser');
    await vuePage.click('button:has-text("Entrar")');
    await expect(vuePage.locator('text=Conectado')).toBeVisible();

    // 5. React sends a message
    const reactInput = reactPage.locator('input[placeholder*="mensaje"]');
    await reactInput.fill('Hola desde React!');
    await reactPage.keyboard.press('Enter');

    // 6. Vue receives the message
    await expect(vuePage.locator('text=ReactUser: Hola desde React!')).toBeVisible();

    // 7. Vue sends a message back
    const vueInput = vuePage.locator('input[placeholder*="mensaje"]');
    await vueInput.fill('Hola desde Vue!');
    await vuePage.keyboard.press('Enter');

    // 8. React receives the message
    await expect(reactPage.locator('text=VueUser: Hola desde Vue!')).toBeVisible();

    // 9. Test Typing Indicator (React starts typing)
    await reactInput.fill('Escribiendo...');
    // Should show in Vue
    await expect(vuePage.locator('.typing-container')).toBeVisible();
    await expect(vuePage.locator('text=ReactUser está escribiendo')).toBeVisible();

    // 10. Stop typing
    await reactPage.keyboard.press('Enter'); // Sends message and stops typing
    await expect(vuePage.locator('.typing-container')).not.toBeVisible();

    await reactContext.close();
    await vueContext.close();
  });
});
