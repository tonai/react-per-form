import { Page, expect } from '@playwright/test';
import { IFormMode, IFormRevalidateMode } from 'react-swift-form';
import path from 'node:path';
import * as url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const submitMsg = 'Submit!';

export async function goto(page: Page, url: string) {
  await page.goto(url);
  await expect(page.getByTestId('form')).toBeVisible();
  return {
    consoleMsg: new Promise((resolve) => {
      page.on('console', (msg) => {
        const text = msg.text();
        if (text.includes(submitMsg)) {
          resolve(true);
        }
      });
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

export async function setFile(
  page: Page,
  testId: string,
  file: string | string[],
) {
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByTestId(testId).click();
  const fileChooser = await fileChooserPromise;
  const files =
    typeof file === 'string'
      ? path.join(__dirname, file)
      : file.map((f) => path.join(__dirname, f));
  await fileChooser.setFiles(files);
}
