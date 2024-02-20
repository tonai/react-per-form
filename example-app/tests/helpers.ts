import { Page, expect } from '@playwright/test';
import { IFormMode } from 'react-form-validation';

export async function goto(page: Page, url: string) {
  await page.goto(url);
  await expect(page.getByTestId('form')).toBeVisible();
  return {
    consoleMsg: new Promise((resolve) => {
      page.on('console', (msg) => resolve(msg.text()));
    }),
  };
}

export async function disableNativeValidation(page: Page) {
  const checkbox = page.getByTestId('useNativeValidation');
  await expect(checkbox).toBeChecked();
  await checkbox.uncheck();
  await expect(checkbox).not.toBeChecked();
}

export async function selectMode(page: Page, mode: IFormMode) {
  const select = page.getByTestId('mode');
  await select.selectOption(mode);
  await expect(select).toHaveValue(mode);
}
