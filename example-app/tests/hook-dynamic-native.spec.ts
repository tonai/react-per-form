import { expect, test } from '@playwright/test';

import { getErrorMessage, goto } from './helpers';

const url = '/hook-dynamic';
const missError = 'Did you miss something ?';
const validatorError = 'The sum must be equal to 12';

test.describe('Hook Dynamic Native', () => {
  // For native errors, we cannot detect whether the error message is displayed or not.
  // We also don't know if the reportValidity function was called or not.
  // So we can't really test the different modes, which is why we only test the submit mode here.
  test('mode=submit', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeEnabled();
    // Add input
    await page.getByTestId('dynamic-add').click();
    await expect(page.getByTestId('dynamic-0')).toBeVisible();
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual(missError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('dynamic-0').focus();
    await page.getByTestId('dynamic-0').blur();
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual(missError);
    await page.getByTestId('dynamic-0').fill('5');
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual(validatorError);
    await page.getByTestId('dynamic-0').blur();
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual(validatorError);
    await page.getByTestId('dynamic-0').fill('');
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual(missError);
    await page.getByTestId('dynamic-0').blur();
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual(missError);
    // submit
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('dynamic-0')).toBeFocused();
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual(missError);
    // fix native error 1
    await page.getByTestId('dynamic-0').fill('5');
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual(validatorError);
    await page.getByTestId('dynamic-0').blur();
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual(validatorError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('dynamic-0')).toBeFocused();
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual(validatorError);
    // fix validator error 1
    await page.getByTestId('dynamic-0').fill('12');
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual('');
    await page.getByTestId('dynamic-0').blur();
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('dynamic-0')).not.toBeFocused();
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual('');
    expect(await consoleMsg).toBe(true);
    // Add input
    await page.getByTestId('dynamic-add').click();
    await expect(page.getByTestId('dynamic-0')).toBeVisible();
    await expect(page.getByTestId('dynamic-1')).toBeVisible();
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual('');
    expect(await getErrorMessage(page, 'dynamic-1')).toEqual(missError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    // fix native error 2
    await page.getByTestId('dynamic-1').fill('7');
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual(validatorError);
    expect(await getErrorMessage(page, 'dynamic-1')).toEqual(validatorError);
    await page.getByTestId('dynamic-1').blur();
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual(validatorError);
    expect(await getErrorMessage(page, 'dynamic-1')).toEqual(validatorError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('dynamic-0')).toBeFocused();
    expect(page.getByTestId('dynamic-1')).not.toBeFocused();
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual(validatorError);
    expect(await getErrorMessage(page, 'dynamic-1')).toEqual(validatorError);
    // fix validator error 2
    await page.getByTestId('dynamic-0').fill('5');
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual('');
    expect(await getErrorMessage(page, 'dynamic-1')).toEqual('');
    await page.getByTestId('dynamic-0').blur();
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual('');
    expect(await getErrorMessage(page, 'dynamic-1')).toEqual('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('dynamic-0')).not.toBeFocused();
    expect(page.getByTestId('dynamic-1')).not.toBeFocused();
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual('');
    expect(await getErrorMessage(page, 'dynamic-1')).toEqual('');
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('dynamic-0').fill('');
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual(missError);
    expect(await getErrorMessage(page, 'dynamic-1')).toEqual(validatorError);
    await page.getByTestId('dynamic-0').blur();
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual(missError);
    expect(await getErrorMessage(page, 'dynamic-1')).toEqual(validatorError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('dynamic-0').fill('5');
    await page.getByTestId('dynamic-0').blur();
    // reset button
    await page.getByTestId('rsf-reset').click();
    await expect(page.getByTestId('dynamic-0')).toHaveValue('');
    await expect(page.getByTestId('dynamic-1')).toHaveValue('');
    expect(await getErrorMessage(page, 'dynamic-0')).toEqual(missError);
    expect(await getErrorMessage(page, 'dynamic-1')).toEqual(missError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
  });
});
