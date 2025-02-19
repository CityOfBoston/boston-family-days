import { test, expect } from '@playwright/test';

test('Valid DEV URL', async ({ page }) => {
  await page.goto('https://d8-dev.boston.gov/family-pass-test');
});

test('Sign Up', async ({ page }) => {
  await page.goto('https://d8-dev.boston.gov/family-pass-test');
  await page.getByRole('button', { name: 'Register Now' }).click();
  await page.waitForURL('https://d8-dev.boston.gov/family-pass-test#/forms');
  await page.fill('#street1', '123 Main St');
  await page.click('button.usa-combo-box__toggle-list');
  await page.click('li#neighborhood--list--option-1');
  await page.inputValue('input#neighborhood');
  await page.fill('#zip', '02115');

  await page.getByRole('button', { name: 'Continue' }).click();

  await page.fill('#firstName', 'firstName-1');
  await page.fill('#lastName', 'lastName-1');
  await page.selectOption('select#dob-month', '03');
  await page.inputValue('select#dob-month');
  await page.fill('#dob-day', '21');
  await page.fill('#dob-year', '2017');
  await page.click('button.usa-combo-box__toggle-list');
  await page.click('li#school--list--option-19');
  await page.inputValue('input#school');
  await page.selectOption('select#grade-month', '03');
  await page.getByRole('button', { name: 'Continue' }).click();
});
