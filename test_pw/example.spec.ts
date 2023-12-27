// src/test.ts
import { test, expect, Page } from '@playwright/test';
const { _electron: electron } = require('playwright');

let window: Promise<Page>;
let electronApp: { firstWindow: () => Page | PromiseLike<Page>; close: () => any };

test.beforeAll(async () => {
  electronApp = await electron.launch({ executablePath: process.env.APP_PATH });
  window = await electronApp.firstWindow();
  const title = await window.title();
  expect(title).toBe('Test');
});

test.afterAll(async () => {
  await electronApp.close();
});

test('can open new electron window', async ({ page }) => {
  // when
  await window.click('text=open window');

  // then
  expect(await electronApp.windows().length).toBe(2);
  const newWindow = electronApp.windows()[1];
  const newWindowMessage = await newWindow.textContent('h1');
  expect(newWindowMessage).toContain('New Window Content');

  // visual test
  await expect(newWindow).toHaveScreenshot('new-window.png');
});
