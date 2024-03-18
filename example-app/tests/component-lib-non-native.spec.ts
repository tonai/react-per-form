import { expect, test } from '@playwright/test';
import {
  disableNativeValidation,
  goto,
  selectMode,
  selectRevalidateMode,
} from './helpers';

const url = '/component-lib';
const missError = 'Did you miss something ?';
const muiValidatorError = 'Choose a date';
const muiMinError = 'minDate';

test.describe('Component Lib Non Native', () => {
  test('mode=submit', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('mui').focus();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('mui').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    // submit
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    // fix native error
    await page.getByTestId('number').fill('42');
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    // fix custom error
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    // fix manual error
    const date = new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date());
    await page.getByTestId('mui').fill(date);
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeEnabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('number').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('number').fill('42');
    await page.getByTestId('number').blur();
    // // reset button
    await page.getByTestId('rfv-reset').click();
    await expect(page.getByTestId('number')).toHaveValue('');
    // await expect(page.getByTestId('mui')).toHaveValue(''); // FIXME
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    // expect(await getErrorMessage(page, 'mui')).toEqual(missError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
  });

  test('mode=change', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectMode(page, 'change');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('mui').focus();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await page.getByTestId('mui').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    // submit
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    // fix native error
    await page.getByTestId('number').fill('42');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    // fix custom error
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    // fix manual error
    const date = new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date());
    await page.getByTestId('mui').fill(date);
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeEnabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('number').fill('');
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('number').fill('42');
    await page.getByTestId('number').blur();
    // // reset button
    await page.getByTestId('rfv-reset').click();
    await expect(page.getByTestId('number')).toHaveValue('');
    // await expect(page.getByTestId('mui')).toHaveValue(''); // FIXME
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    // expect(await getErrorMessage(page, 'mui')).toEqual(missError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
  });

  test('mode=blur', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectMode(page, 'blur');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('mui').focus();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    // Here we have muiValidatorError and not missError because when the field is focused
    // the value is set to MM/DD/YYYY by mui, that's why it trigger the validation error
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await page.getByTestId('mui').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    // submit
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    // fix native error
    await page.getByTestId('number').fill('42');
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    // fix custom error
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    // fix manual error
    const date = new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date());
    await page.getByTestId('mui').fill(date);
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeEnabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('number').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('number').fill('42');
    await page.getByTestId('number').blur();
    // // reset button
    await page.getByTestId('rfv-reset').click();
    await expect(page.getByTestId('number')).toHaveValue('');
    // await expect(page.getByTestId('mui')).toHaveValue(''); // FIXME
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    // expect(await getErrorMessage(page, 'mui')).toEqual(missError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
  });

  test('mode=all', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectMode(page, 'all');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('mui').focus();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    // Here we have muiValidatorError and not missError because when the field is focused
    // the value is set to MM/DD/YYYY by mui, that's why it trigger the validation error
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await page.getByTestId('mui').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    // submit
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    // fix native error
    await page.getByTestId('number').fill('42');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    // fix custom error
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    // fix manual error
    const date = new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date());
    await page.getByTestId('mui').fill(date);
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeEnabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('number').fill('');
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('number').fill('42');
    await page.getByTestId('number').blur();
    // // reset button
    await page.getByTestId('rfv-reset').click();
    await expect(page.getByTestId('number')).toHaveValue('');
    // await expect(page.getByTestId('mui')).toHaveValue(''); // FIXME
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    // expect(await getErrorMessage(page, 'mui')).toEqual(missError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
  });

  test('revalidateMode=change', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectRevalidateMode(page, 'change');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('mui').focus();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('mui').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    // submit
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    // fix native error
    await page.getByTestId('number').fill('42');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    // fix custom error
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    // fix manual error
    const date = new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date());
    await page.getByTestId('mui').fill(date);
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeEnabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('number').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('number').fill('42');
    await page.getByTestId('number').blur();
    // // reset button
    await page.getByTestId('rfv-reset').click();
    await expect(page.getByTestId('number')).toHaveValue('');
    // await expect(page.getByTestId('mui')).toHaveValue(''); // FIXME
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    // expect(await getErrorMessage(page, 'mui')).toEqual(missError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
  });

  test('revalidateMode=blur', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectRevalidateMode(page, 'blur');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('mui').focus();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('mui').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    // submit
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    // fix native error
    await page.getByTestId('number').fill('42');
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    // fix custom error
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    // fix manual error
    const date = new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date());
    await page.getByTestId('mui').fill(date);
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeEnabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('number').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('number').fill('42');
    await page.getByTestId('number').blur();
    // // reset button
    await page.getByTestId('rfv-reset').click();
    await expect(page.getByTestId('number')).toHaveValue('');
    // await expect(page.getByTestId('mui')).toHaveValue(''); // FIXME
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    // expect(await getErrorMessage(page, 'mui')).toEqual(missError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
  });
});
