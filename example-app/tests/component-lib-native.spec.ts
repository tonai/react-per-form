import { expect, test } from '@playwright/test';
import { getErrorMessage, goto } from './helpers';

const url = '/component-lib';
const missError = 'Did you miss something ?';
const muiValidatorError = 'Choose a date';
const muiMinError = 'Select a date in the future';

test.describe('Component Lib Native', () => {
  // For native errors, we cannot detect whether the error message is displayed or not.
  // We also don't know if the reportValidity function was called or not.
  // So we can't really test the different modes, which is why we only test the submit mode here.
  test('mode=submit', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    expect(await getErrorMessage(page, 'number')).toEqual(missError);
    expect(await getErrorMessage(page, 'mui')).toEqual(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('mui').focus();
    await page.getByTestId('mui').blur();
    expect(await getErrorMessage(page, 'number')).toEqual(missError);
    expect(await getErrorMessage(page, 'mui')).toEqual(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('mui').fill('01/01/2024');
    expect(await getErrorMessage(page, 'number')).toEqual(missError);
    expect(await getErrorMessage(page, 'mui')).toEqual(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await page.getByTestId('mui').blur();
    expect(await getErrorMessage(page, 'number')).toEqual(missError);
    expect(await getErrorMessage(page, 'mui')).toEqual(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await page.getByTestId('mui').fill('');
    expect(await getErrorMessage(page, 'number')).toEqual(missError);
    expect(await getErrorMessage(page, 'mui')).toEqual(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('mui').blur();
    expect(await getErrorMessage(page, 'number')).toEqual(missError);
    expect(await getErrorMessage(page, 'mui')).toEqual(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText('');
    // submit
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    expect(await getErrorMessage(page, 'number')).toEqual(missError);
    expect(await getErrorMessage(page, 'mui')).toEqual(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText('');
    // fix native error
    await page.getByTestId('number').fill('42');
    expect(await getErrorMessage(page, 'number')).toEqual('');
    expect(await getErrorMessage(page, 'mui')).toEqual(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('number').blur();
    expect(await getErrorMessage(page, 'number')).toEqual('');
    expect(await getErrorMessage(page, 'mui')).toEqual(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    expect(await getErrorMessage(page, 'number')).toEqual('');
    expect(await getErrorMessage(page, 'mui')).toEqual(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    // fix custom error
    await page.getByTestId('mui').fill('01/01/2024');
    expect(await getErrorMessage(page, 'number')).toEqual('');
    expect(await getErrorMessage(page, 'mui')).toEqual(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await page.getByTestId('mui').blur();
    expect(await getErrorMessage(page, 'number')).toEqual('');
    expect(await getErrorMessage(page, 'mui')).toEqual(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    expect(await getErrorMessage(page, 'number')).toEqual('');
    expect(await getErrorMessage(page, 'mui')).toEqual(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    // fix manual error
    const today = new Date();
    const date = new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(today);
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(today);
    await page.getByTestId('mui').fill(date);
    expect(await getErrorMessage(page, 'number')).toEqual('');
    expect(await getErrorMessage(page, 'mui')).toEqual('');
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await page.getByTestId('mui').blur();
    expect(await getErrorMessage(page, 'number')).toEqual('');
    expect(await getErrorMessage(page, 'mui')).toEqual('');
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    expect(await getErrorMessage(page, 'number')).toEqual('');
    expect(await getErrorMessage(page, 'mui')).toEqual('');
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('number').fill('');
    expect(await getErrorMessage(page, 'number')).toEqual(missError);
    expect(await getErrorMessage(page, 'mui')).toEqual('');
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await page.getByTestId('number').blur();
    expect(await getErrorMessage(page, 'number')).toEqual(missError);
    expect(await getErrorMessage(page, 'mui')).toEqual('');
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('number').fill('42');
    await page.getByTestId('number').blur();
    // reset button
    await page.getByTestId('rsf-reset').click();
    await expect(page.getByTestId('number')).toHaveValue('');
    await expect(page.getByTestId('mui')).toHaveValue('');
    expect(await getErrorMessage(page, 'number')).toEqual(missError);
    expect(await getErrorMessage(page, 'mui')).toEqual(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
  });
});
