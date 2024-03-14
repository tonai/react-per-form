import { expect, test } from '@playwright/test';
import { getErrorMessage, goto } from './helpers';

const url = '/hook-lib';
const missError = 'Did you miss something ?';
const muiError = 'Choose a date';

test.describe('Component Lib Native', () => {
  // For native errors, we cannot detect whether the error message is displayed or not.
  // We also don't know if the reportValidity function was called or not.
  // So we can't really test the different modes, which is why we only test the submit mode here.
  test('mode=submit', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    expect(await getErrorMessage(page, 'number')).toEqual(missError);
    expect(await getErrorMessage(page, 'mui')).toEqual(missError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('mui').focus();
    await page.getByTestId('mui').blur();
    expect(await getErrorMessage(page, 'number')).toEqual(missError);
    expect(await getErrorMessage(page, 'mui')).toEqual(missError);
    await page.getByTestId('mui').fill('01/01/2024');
    expect(await getErrorMessage(page, 'number')).toEqual(missError);
    expect(await getErrorMessage(page, 'mui')).toEqual('');
    await page.getByTestId('mui').blur();
    expect(await getErrorMessage(page, 'number')).toEqual(missError);
    expect(await getErrorMessage(page, 'mui')).toEqual('');
    await page.getByTestId('mui').fill('');
    expect(await getErrorMessage(page, 'number')).toEqual(missError);
    expect(await getErrorMessage(page, 'mui')).toEqual(muiError);
    await page.getByTestId('mui').blur();
    expect(await getErrorMessage(page, 'number')).toEqual(missError);
    expect(await getErrorMessage(page, 'mui')).toEqual(muiError);
    // submit
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    expect(await getErrorMessage(page, 'number')).toEqual(missError);
    expect(await getErrorMessage(page, 'mui')).toEqual(muiError);
    // fix native error
    await page.getByTestId('number').fill('42');
    expect(await getErrorMessage(page, 'number')).toEqual('');
    expect(await getErrorMessage(page, 'mui')).toEqual(missError);
    await page.getByTestId('number').blur();
    expect(await getErrorMessage(page, 'number')).toEqual('');
    expect(await getErrorMessage(page, 'mui')).toEqual(missError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    expect(await getErrorMessage(page, 'number')).toEqual('');
    expect(await getErrorMessage(page, 'mui')).toEqual(missError);
    // fix custom error
    await page.getByTestId('mui').fill('01/01/2024');
    expect(await getErrorMessage(page, 'number')).toEqual('');
    expect(await getErrorMessage(page, 'mui')).toEqual('');
    await page.getByTestId('mui').blur();
    expect(await getErrorMessage(page, 'number')).toEqual('');
    expect(await getErrorMessage(page, 'mui')).toEqual('');
    await expect(page.getByTestId('rfv-submit-disabled')).toBeEnabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    expect(await getErrorMessage(page, 'number')).toEqual('');
    expect(await getErrorMessage(page, 'mui')).toEqual('');
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('number').fill('');
    expect(await getErrorMessage(page, 'number')).toEqual(missError);
    expect(await getErrorMessage(page, 'mui')).toEqual('');
    await page.getByTestId('number').blur();
    expect(await getErrorMessage(page, 'number')).toEqual(missError);
    expect(await getErrorMessage(page, 'mui')).toEqual('');
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('number').fill('42');
    await page.getByTestId('number').blur();
    // reset button
    await page.getByTestId('rfv-reset').click();
    await expect(page.getByTestId('number')).toHaveValue('');
    // await expect(page.getByTestId('mui')).toHaveValue(''); // FIXME
    expect(await getErrorMessage(page, 'number')).toEqual(missError);
    // expect(await getErrorMessage(page, 'mui')).toEqual(missError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
  });
});
