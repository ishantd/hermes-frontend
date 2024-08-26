import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // Go to the login page -- simply
  await page.goto('https://hermes.ishantdahiya.com/');
  await page.goto('https://hermes.ishantdahiya.com/signup');

  // try signing up with an existing email
  await page.getByPlaceholder('Enter your email').click();
  await page.getByPlaceholder('Enter your email').fill('test@artisan.co');
  await page.getByPlaceholder('Enter your name').click();
  await page.getByPlaceholder('Enter your name').fill('Artisan');
  await page.getByPlaceholder('Create a password').click();
  await page.getByPlaceholder('Create a password').fill('password');
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await expect(page.getByText('User already exists.')).toBeVisible();
  

  const randomEmail = `test${Math.floor(Math.random() * 10000)}@artisan.co`;

  // Navigate to the signup page
  await page.goto('https://hermes.ishantdahiya.com/signup');

  // Fill in the signup form
  await page.getByPlaceholder('Enter your email').click();
  await page.getByPlaceholder('Enter your email').fill(randomEmail);
  await page.getByPlaceholder('Enter your name').click();
  await page.getByPlaceholder('Enter your name').fill('Artisan');
  await page.getByPlaceholder('Create a password').click();
  await page.getByPlaceholder('Create a password').fill('password');

  // Submit the signup form
  await page.getByRole('button', { name: 'Sign Up' }).click();

  // Expect the page to show a message field, which indicates a successful signup
  await expect(page.getByPlaceholder('Type your message...')).toBeVisible();

  // Send a message
  await page.getByPlaceholder('Type your message...').click();
  await page.getByPlaceholder('Type your message...').fill('Hello, how do you do?');
  await page.getByPlaceholder('Type your message...').press('Enter');

  // Click on a part of the message history (as indicated by the selector)
  await page.locator('.p-4 > div:nth-child(2) > .flex').click();
  // expect the message to be visible
  await expect(page.locator('.p-4 > div:nth-child(2) > .flex')).toBeVisible();

  // Log out
  await page.getByRole('button', { name: 'Logout' }).click();

  // Expect the page to navigate back to the login or home page after logout
  await expect(page).toHaveURL('https://hermes.ishantdahiya.com/login');

});