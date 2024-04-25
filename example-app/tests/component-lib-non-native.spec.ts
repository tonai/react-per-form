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
const muiValidatorError = 'Choose a date after the 15th.';
const muiMinError = 'Select a date in the future';

test.describe('Component Lib Non Native', () => {
  test('mode=submit', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await expect(page.getByTestId('number')).toHaveValue('0');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
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
    await page.getByTestId('rpf-submit').click();
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
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
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
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    // fix manual error
    const today = new Date();
    const dateAfterTodayButBelowThe15 = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1,
    );
    const dateAfterTodayButBelowThe15Us = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayButBelowThe15);
    const dateAfterTodayButBelowThe15Fr = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayButBelowThe15);
    await page.getByTestId('mui').fill(dateAfterTodayButBelowThe15Us);
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayButBelowThe15Fr,
    );
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayButBelowThe15Fr,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayButBelowThe15Fr,
    );
    // fix validator error
    const dateAfterTodayAndAfterThe15 = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      16,
    );
    const dateAfterTodayAndAfterThe15Us = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayAndAfterThe15);
    const dateAfterTodayAndAfterThe15Fr = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayAndAfterThe15);
    await page.getByTestId('mui').fill(dateAfterTodayAndAfterThe15Us);
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('number').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('number').fill('42');
    await page.getByTestId('number').blur();
    // // reset button
    await page.getByTestId('rpf-reset').click();
    await expect(page.getByTestId('number')).toHaveValue('12');
    await expect(page.getByTestId('mui')).toHaveValue('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
  });

  test('mode=change', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectMode(page, 'change');
    await expect(page.getByTestId('number')).toHaveValue('0');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
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
    await page.getByTestId('rpf-submit').click();
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
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
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
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    // fix manual error
    const today = new Date();
    const dateAfterTodayButBelowThe15 = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1,
    );
    const dateAfterTodayButBelowThe15Us = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayButBelowThe15);
    const dateAfterTodayButBelowThe15Fr = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayButBelowThe15);
    await page.getByTestId('mui').fill(dateAfterTodayButBelowThe15Us);
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayButBelowThe15Fr,
    );
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayButBelowThe15Fr,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayButBelowThe15Fr,
    );
    // fix validator error
    const dateAfterTodayAndAfterThe15 = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      16,
    );
    const dateAfterTodayAndAfterThe15Us = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayAndAfterThe15);
    const dateAfterTodayAndAfterThe15Fr = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayAndAfterThe15);
    await page.getByTestId('mui').fill(dateAfterTodayAndAfterThe15Us);
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('number').fill('');
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('number').fill('42');
    await page.getByTestId('number').blur();
    // // reset button
    await page.getByTestId('rpf-reset').click();
    await expect(page.getByTestId('number')).toHaveValue('12');
    await expect(page.getByTestId('mui')).toHaveValue('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
  });

  test('mode=blur', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectMode(page, 'blur');
    await expect(page.getByTestId('number')).toHaveValue('0');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('mui').focus();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    await page.getByTestId('mui').fill('01/01/2024');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
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
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    // submit
    await page.getByTestId('rpf-submit').click();
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
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
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
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    // fix manual error
    const today = new Date();
    const dateAfterTodayButBelowThe15 = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1,
    );
    const dateAfterTodayButBelowThe15Us = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayButBelowThe15);
    const dateAfterTodayButBelowThe15Fr = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayButBelowThe15);
    await page.getByTestId('mui').fill(dateAfterTodayButBelowThe15Us);
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayButBelowThe15Fr,
    );
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayButBelowThe15Fr,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayButBelowThe15Fr,
    );
    // fix validator error
    const dateAfterTodayAndAfterThe15 = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      16,
    );
    const dateAfterTodayAndAfterThe15Us = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayAndAfterThe15);
    const dateAfterTodayAndAfterThe15Fr = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayAndAfterThe15);
    await page.getByTestId('mui').fill(dateAfterTodayAndAfterThe15Us);
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('number').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('number').fill('42');
    await page.getByTestId('number').blur();
    // // reset button
    await page.getByTestId('rpf-reset').click();
    await expect(page.getByTestId('number')).toHaveValue('12');
    await expect(page.getByTestId('mui')).toHaveValue('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
  });

  test('mode=all', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectMode(page, 'all');
    await expect(page.getByTestId('number')).toHaveValue('0');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('mui').focus();
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
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
    await expect(page.getByTestId('mui-error')).toHaveText(missError);
    await expect(page.getByTestId('watch')).toHaveText('');
    // submit
    await page.getByTestId('rpf-submit').click();
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
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
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
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    // fix manual error
    const today = new Date();
    const dateAfterTodayButBelowThe15 = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1,
    );
    const dateAfterTodayButBelowThe15Us = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayButBelowThe15);
    const dateAfterTodayButBelowThe15Fr = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayButBelowThe15);
    await page.getByTestId('mui').fill(dateAfterTodayButBelowThe15Us);
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayButBelowThe15Fr,
    );
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayButBelowThe15Fr,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayButBelowThe15Fr,
    );
    // fix validator error
    const dateAfterTodayAndAfterThe15 = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      16,
    );
    const dateAfterTodayAndAfterThe15Us = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayAndAfterThe15);
    const dateAfterTodayAndAfterThe15Fr = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayAndAfterThe15);
    await page.getByTestId('mui').fill(dateAfterTodayAndAfterThe15Us);
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('number').fill('');
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('number').fill('42');
    await page.getByTestId('number').blur();
    // // reset button
    await page.getByTestId('rpf-reset').click();
    await expect(page.getByTestId('number')).toHaveValue('12');
    await expect(page.getByTestId('mui')).toHaveValue('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
  });

  test('revalidateMode=change', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectRevalidateMode(page, 'change');
    await expect(page.getByTestId('number')).toHaveValue('0');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
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
    await page.getByTestId('rpf-submit').click();
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
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
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
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    // fix manual error
    const today = new Date();
    const dateAfterTodayButBelowThe15 = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1,
    );
    const dateAfterTodayButBelowThe15Us = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayButBelowThe15);
    const dateAfterTodayButBelowThe15Fr = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayButBelowThe15);
    await page.getByTestId('mui').fill(dateAfterTodayButBelowThe15Us);
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayButBelowThe15Fr,
    );
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayButBelowThe15Fr,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayButBelowThe15Fr,
    );
    // fix validator error
    const dateAfterTodayAndAfterThe15 = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      16,
    );
    const dateAfterTodayAndAfterThe15Us = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayAndAfterThe15);
    const dateAfterTodayAndAfterThe15Fr = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayAndAfterThe15);
    await page.getByTestId('mui').fill(dateAfterTodayAndAfterThe15Us);
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('number').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('number').fill('42');
    await page.getByTestId('number').blur();
    // // reset button
    await page.getByTestId('rpf-reset').click();
    await expect(page.getByTestId('number')).toHaveValue('12');
    await expect(page.getByTestId('mui')).toHaveValue('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
  });

  test('revalidateMode=blur', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectRevalidateMode(page, 'blur');
    await expect(page.getByTestId('number')).toHaveValue('0');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText('');
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
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
    await page.getByTestId('rpf-submit').click();
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
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
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
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText('01/01/2024');
    // fix manual error
    const today = new Date();
    const dateAfterTodayButBelowThe15 = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1,
    );
    const dateAfterTodayButBelowThe15Us = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayButBelowThe15);
    const dateAfterTodayButBelowThe15Fr = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayButBelowThe15);
    await page.getByTestId('mui').fill(dateAfterTodayButBelowThe15Us);
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiMinError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayButBelowThe15Fr,
    );
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayButBelowThe15Fr,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayButBelowThe15Fr,
    );
    // fix validator error
    const dateAfterTodayAndAfterThe15 = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      16,
    );
    const dateAfterTodayAndAfterThe15Us = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayAndAfterThe15);
    const dateAfterTodayAndAfterThe15Fr = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateAfterTodayAndAfterThe15);
    await page.getByTestId('mui').fill(dateAfterTodayAndAfterThe15Us);
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).toHaveText(muiValidatorError);
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await page.getByTestId('mui').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('number')).not.toBeFocused();
    expect(page.getByTestId('mui')).not.toBeFocused();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('number').fill('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('watch')).toHaveText(
      dateAfterTodayAndAfterThe15Fr,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('number').fill('42');
    await page.getByTestId('number').blur();
    // // reset button
    await page.getByTestId('rpf-reset').click();
    await expect(page.getByTestId('number')).toHaveValue('12');
    await expect(page.getByTestId('mui')).toHaveValue('');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('mui-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
  });
});
