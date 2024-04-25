import { expect, test } from '@playwright/test';

import {
  disableNativeValidation,
  goto,
  selectMode,
  selectRevalidateMode,
} from './helpers';

const url = '/hook-dynamic';
const missError = 'Did you miss something ?';
const validatorError = 'The sum must be equal to 12';

test.describe('Hook Dynamic Non Native', () => {
  test('mode=submit', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    // Add input
    await page.getByTestId('dynamic-add').click();
    await expect(page.getByTestId('dynamic-0')).toBeVisible();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('dynamic-0').focus();
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-0').fill('5');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-0').fill('');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    // submit
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    // fix native error 1
    await page.getByTestId('dynamic-0').fill('5');
    await expect(page.getByTestId('dynamic-0-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    // fix validator error 1
    await page.getByTestId('dynamic-0').fill('12');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).not.toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    // Add input
    await page.getByTestId('dynamic-add').click();
    await expect(page.getByTestId('dynamic-1')).toBeVisible();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    // fix native error 2
    await page.getByTestId('dynamic-1').fill('7');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-1').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).toBeFocused();
    expect(page.getByTestId('dynamic-1')).not.toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    // fix validator error 2
    await page.getByTestId('dynamic-0').fill('5');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).not.toBeFocused();
    expect(page.getByTestId('dynamic-1')).not.toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    // Remove input
    await page.getByTestId('dynamic-0-remove').click();
    await expect(page.getByTestId('dynamic-0')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    // manual reset
    await page.getByTestId('dynamic-1').fill('');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-1').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('dynamic-1').fill('7');
    await page.getByTestId('dynamic-1').blur();
    // reset button
    await page.getByTestId('rpf-reset').click();
    await expect(page.getByTestId('dynamic-0')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1')).toHaveValue('');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
  });

  test('mode=change', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectMode(page, 'change');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    // Add input
    await page.getByTestId('dynamic-add').click();
    await expect(page.getByTestId('dynamic-0')).toBeVisible();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('dynamic-0').focus();
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-0').fill('5');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').fill('');
    await expect(page.getByTestId('dynamic-0-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    // submit
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    // fix native error 1
    await page.getByTestId('dynamic-0').fill('5');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    // fix validator error 1
    await page.getByTestId('dynamic-0').fill('12');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).not.toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    // Add input
    await page.getByTestId('dynamic-add').click();
    await expect(page.getByTestId('dynamic-1')).toBeVisible();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    // fix native error 2
    await page.getByTestId('dynamic-1').fill('7');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-1').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).toBeFocused();
    expect(page.getByTestId('dynamic-1')).not.toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    // fix validator error 2
    await page.getByTestId('dynamic-0').fill('5');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).not.toBeFocused();
    expect(page.getByTestId('dynamic-1')).not.toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    // Remove input
    await page.getByTestId('dynamic-0-remove').click();
    await expect(page.getByTestId('dynamic-0')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    // manual reset
    await page.getByTestId('dynamic-1').fill('');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-1').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('dynamic-1').fill('7');
    await page.getByTestId('dynamic-1').blur();
    // reset button
    await page.getByTestId('rpf-reset').click();
    await expect(page.getByTestId('dynamic-0')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1')).toHaveValue('');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
  });

  test('mode=blur', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectMode(page, 'blur');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    // Add input
    await page.getByTestId('dynamic-add').click();
    await expect(page.getByTestId('dynamic-0')).toBeVisible();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('dynamic-0').focus();
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').fill('5');
    await expect(page.getByTestId('dynamic-0-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').fill('');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    // submit
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    // fix native error 1
    await page.getByTestId('dynamic-0').fill('5');
    await expect(page.getByTestId('dynamic-0-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    // fix validator error 1
    await page.getByTestId('dynamic-0').fill('12');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).not.toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    // Add input
    await page.getByTestId('dynamic-add').click();
    await expect(page.getByTestId('dynamic-1')).toBeVisible();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    // fix native error 2
    await page.getByTestId('dynamic-1').fill('7');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-1').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).toBeFocused();
    expect(page.getByTestId('dynamic-1')).not.toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    // fix validator error 2
    await page.getByTestId('dynamic-0').fill('5');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).not.toBeFocused();
    expect(page.getByTestId('dynamic-1')).not.toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    // Remove input
    await page.getByTestId('dynamic-0-remove').click();
    await expect(page.getByTestId('dynamic-0')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    // manual reset
    await page.getByTestId('dynamic-1').fill('');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-1').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('dynamic-1').fill('7');
    await page.getByTestId('dynamic-1').blur();
    // reset button
    await page.getByTestId('rpf-reset').click();
    await expect(page.getByTestId('dynamic-0')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1')).toHaveValue('');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
  });

  test('mode=all', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectMode(page, 'all');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    // Add input
    await page.getByTestId('dynamic-add').click();
    await expect(page.getByTestId('dynamic-0')).toBeVisible();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('dynamic-0').focus();
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').fill('5');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').fill('');
    await expect(page.getByTestId('dynamic-0-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    // submit
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    // fix native error 1
    await page.getByTestId('dynamic-0').fill('5');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    // fix validator error 1
    await page.getByTestId('dynamic-0').fill('12');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).not.toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    // Add input
    await page.getByTestId('dynamic-add').click();
    await expect(page.getByTestId('dynamic-1')).toBeVisible();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    // fix native error 2
    await page.getByTestId('dynamic-1').fill('7');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-1').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).toBeFocused();
    expect(page.getByTestId('dynamic-1')).not.toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    // fix validator error 2
    await page.getByTestId('dynamic-0').fill('5');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).not.toBeFocused();
    expect(page.getByTestId('dynamic-1')).not.toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    // Remove input
    await page.getByTestId('dynamic-0-remove').click();
    await expect(page.getByTestId('dynamic-0')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    // manual reset
    await page.getByTestId('dynamic-1').fill('');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-1').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('dynamic-1').fill('7');
    await page.getByTestId('dynamic-1').blur();
    // reset button
    await page.getByTestId('rpf-reset').click();
    await expect(page.getByTestId('dynamic-0')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1')).toHaveValue('');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
  });

  test('revalidateMode=change', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectRevalidateMode(page, 'change');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    // Add input
    await page.getByTestId('dynamic-add').click();
    await expect(page.getByTestId('dynamic-0')).toBeVisible();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('dynamic-0').focus();
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-0').fill('5');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-0').fill('');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    // submit
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    // fix native error 1
    await page.getByTestId('dynamic-0').fill('5');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    // fix validator error 1
    await page.getByTestId('dynamic-0').fill('12');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).not.toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    // Add input
    await page.getByTestId('dynamic-add').click();
    await expect(page.getByTestId('dynamic-1')).toBeVisible();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    // fix native error 2
    await page.getByTestId('dynamic-1').fill('7');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-1').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).toBeFocused();
    expect(page.getByTestId('dynamic-1')).not.toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    // fix validator error 2
    await page.getByTestId('dynamic-0').fill('5');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).not.toBeFocused();
    expect(page.getByTestId('dynamic-1')).not.toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    // Remove input
    await page.getByTestId('dynamic-0-remove').click();
    await expect(page.getByTestId('dynamic-0')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    // manual reset
    await page.getByTestId('dynamic-1').fill('');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-1').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('dynamic-1').fill('7');
    await page.getByTestId('dynamic-1').blur();
    // reset button
    await page.getByTestId('rpf-reset').click();
    await expect(page.getByTestId('dynamic-0')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1')).toHaveValue('');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
  });

  test('revalidateMode=blur', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectRevalidateMode(page, 'blur');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    // Add input
    await page.getByTestId('dynamic-add').click();
    await expect(page.getByTestId('dynamic-0')).toBeVisible();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('dynamic-0').focus();
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-0').fill('5');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-0').fill('');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    // submit
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    // fix native error 1
    await page.getByTestId('dynamic-0').fill('5');
    await expect(page.getByTestId('dynamic-0-error')).toHaveText(missError);
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    // fix validator error 1
    await page.getByTestId('dynamic-0').fill('12');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).not.toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    // Add input
    await page.getByTestId('dynamic-add').click();
    await expect(page.getByTestId('dynamic-1')).toBeVisible();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    // fix native error 2
    await page.getByTestId('dynamic-1').fill('7');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-1').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).toBeFocused();
    expect(page.getByTestId('dynamic-1')).not.toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    // fix validator error 2
    await page.getByTestId('dynamic-0').fill('5');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).toHaveText(
      validatorError,
    );
    await page.getByTestId('dynamic-0').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('dynamic-0')).not.toBeFocused();
    expect(page.getByTestId('dynamic-1')).not.toBeFocused();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    // Remove input
    await page.getByTestId('dynamic-0-remove').click();
    await expect(page.getByTestId('dynamic-0')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    // manual reset
    await page.getByTestId('dynamic-1').fill('');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await page.getByTestId('dynamic-1').blur();
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('dynamic-1').fill('7');
    await page.getByTestId('dynamic-1').blur();
    // reset button
    await page.getByTestId('rpf-reset').click();
    await expect(page.getByTestId('dynamic-0')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1')).toHaveValue('');
    await expect(page.getByTestId('dynamic-0-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-1-error')).not.toBeVisible();
    await expect(page.getByTestId('dynamic-validator-error')).not.toBeVisible();
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
  });
});
