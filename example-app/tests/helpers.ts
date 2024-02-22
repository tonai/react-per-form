import { Page, expect } from '@playwright/test';
import { IFormMode, IFormRevalidateMode } from 'react-form-validation';

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

export async function selectRevalidateMode(
  page: Page,
  mode: IFormRevalidateMode,
) {
  const select = page.getByTestId('revalidate-mode');
  await select.selectOption(mode);
  await expect(select).toHaveValue(mode);
}

export function getErrorMessage(page: Page, testId: string): Promise<string> {
  return page
    .getByTestId(testId)
    .evaluate((element) => (element as HTMLInputElement).validationMessage);
}
