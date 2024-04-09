import { expect, test } from '@playwright/test';
import {
  disableNativeValidation,
  goto,
  selectMode,
  selectRevalidateMode,
} from './helpers';

const url = '/component-lib';
const minError = 'Value is too low';
const missError = 'Did you miss something ?';
const muiValidatorError = 'Choose a date';
const muiMinError = 'Select a date in the future';

test.describe('Component Lib Non Native', () => {
  test('mode=submit', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await expect(page.getByTestId('number')).toHaveValue('0');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('mui').focus();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await page.getByTestId('mui').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    // submit
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).toHaveText(minError);
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    // fix native error
    await page.getByTestId('number').fill('42');
    await expect(page.getByTestId('number-error')).toHaveText(minError);
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).toHaveText(minError);
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    // fix custom error
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
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
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('number').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('number').fill('42');
    await page.getByTestId('number').blur();
    // // reset button
    await page.getByTestId('rsf-reset').click();
    await expect(page.getByTestId('number')).toHaveValue('12');
    await expect(page.getByTestId('mui')).toHaveValue('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
  });

  test('mode=change', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectMode(page, 'change');
    await expect(page.getByTestId('number')).toHaveValue('0');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('mui').focus();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await page.getByTestId('mui').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText('');
    // submit
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).toHaveText(minError);
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    // fix native error
    await page.getByTestId('number').fill('42');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    // fix custom error
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
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
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('number').fill('');
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('number').fill('42');
    await page.getByTestId('number').blur();
    // // reset button
    await page.getByTestId('rsf-reset').click();
    await expect(page.getByTestId('number')).toHaveValue('12');
    await expect(page.getByTestId('mui')).toHaveValue('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
  });

  test('mode=blur', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectMode(page, 'blur');
    await expect(page.getByTestId('number')).toHaveValue('0');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('mui').focus();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    // Here we have muiValidatorError and not missError because when the field is focused
    // the value is set to MM/DD/YYYY by mui, that's why it trigger the validation error
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await page.getByTestId('mui').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText('');
    // submit
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).toHaveText(minError);
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    // fix native error
    await page.getByTestId('number').fill('42');
    await expect(page.getByTestId('number-error')).toHaveText(minError);
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    // fix custom error
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
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
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('number').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('number').fill('42');
    await page.getByTestId('number').blur();
    // // reset button
    await page.getByTestId('rsf-reset').click();
    await expect(page.getByTestId('number')).toHaveValue('12');
    await expect(page.getByTestId('mui')).toHaveValue('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
  });

  test('mode=all', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectMode(page, 'all');
    await expect(page.getByTestId('number')).toHaveValue('0');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('mui').focus();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    // Here we have muiValidatorError and not missError because when the field is focused
    // the value is set to MM/DD/YYYY by mui, that's why it trigger the validation error
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await page.getByTestId('mui').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText('');
    // submit
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).toHaveText(minError);
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    // fix native error
    await page.getByTestId('number').fill('42');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    // fix custom error
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
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
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('number').fill('');
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('number').fill('42');
    await page.getByTestId('number').blur();
    // // reset button
    await page.getByTestId('rsf-reset').click();
    await expect(page.getByTestId('number')).toHaveValue('12');
    await expect(page.getByTestId('mui')).toHaveValue('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
  });

  test('revalidateMode=change', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectRevalidateMode(page, 'change');
    await expect(page.getByTestId('number')).toHaveValue('0');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('mui').focus();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await page.getByTestId('mui').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    // submit
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).toHaveText(minError);
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    // fix native error
    await page.getByTestId('number').fill('42');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    // fix custom error
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
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
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('number').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('number').fill('42');
    await page.getByTestId('number').blur();
    // // reset button
    await page.getByTestId('rsf-reset').click();
    await expect(page.getByTestId('number')).toHaveValue('12');
    await expect(page.getByTestId('mui')).toHaveValue('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
  });

  test('revalidateMode=blur', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectRevalidateMode(page, 'blur');
    await expect(page.getByTestId('number')).toHaveValue('0');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('mui').focus();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await page.getByTestId('mui').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    // submit
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).toHaveText(minError);
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    // fix native error
    await page.getByTestId('number').fill('42');
    await expect(page.getByTestId('number-error')).toHaveText(minError);
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    // fix custom error
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
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
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('number').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(formattedDate);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('number').fill('42');
    await page.getByTestId('number').blur();
    // // reset button
    await page.getByTestId('rsf-reset').click();
    await expect(page.getByTestId('number')).toHaveValue('12');
    await expect(page.getByTestId('mui')).toHaveValue('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
  });
});
