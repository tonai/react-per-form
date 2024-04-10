import { expect, test } from '@playwright/test';

import {
  disableNativeValidation,
  goto,
  selectMode,
  selectRevalidateMode,
} from './helpers';

const url = '/';
const missError = 'Did you miss something ?';
const fooError = 'Value does not include "foo"';
const barError = 'Value should also contains "bar"';
const submitText =
  'This form has been submitted 1 time(s) in total and the last value submitted is "foobar"';

test.describe('Hook Simple Non Native', () => {
  test('mode=submit', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('message')).toHaveText('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('simple').focus();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    // submit
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('message')).toHaveText('');
    // fix native error
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('message')).toHaveText('');
    // fix custom error
    await page.getByTestId('simple').fill('foo');
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(barError);
    await expect(page.getByTestId('message')).toHaveText('');
    // fix global error
    await page.getByTestId('simple').fill('foobar');
    await expect(page.getByTestId('simple-error')).toHaveText(barError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(barError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).not.toBeFocused();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    await expect(page.getByTestId('message')).toHaveText(submitText);
    // manual reset
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    // reset button
    await page.getByTestId('rsf-reset').click();
    await expect(page.getByTestId('simple')).toHaveValue('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
  });

  test('mode=change', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectMode(page, 'change');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('message')).toHaveText('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('simple').focus();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    // submit
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('message')).toHaveText('');
    // fix native error
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('message')).toHaveText('');
    // fix custom error
    await page.getByTestId('simple').fill('foo');
    await expect(page.getByTestId('simple-error')).toHaveText(barError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(barError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(barError);
    await expect(page.getByTestId('message')).toHaveText('');
    // fix global error
    await page.getByTestId('simple').fill('foobar');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).not.toBeFocused();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    await expect(page.getByTestId('message')).toHaveText(submitText);
    // manual reset
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    // reset button
    await page.getByTestId('rsf-reset').click();
    await expect(page.getByTestId('simple')).toHaveValue('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
  });

  test('mode=blur', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectMode(page, 'blur');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('message')).toHaveText('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('simple').focus();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    // submit
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('message')).toHaveText('');
    // fix native error
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('message')).toHaveText('');
    // fix custom error
    await page.getByTestId('simple').fill('foo');
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(barError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(barError);
    await expect(page.getByTestId('message')).toHaveText('');
    // fix global error
    await page.getByTestId('simple').fill('foobar');
    await expect(page.getByTestId('simple-error')).toHaveText(barError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).not.toBeFocused();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    await expect(page.getByTestId('message')).toHaveText(submitText);
    // manual reset
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    // reset button
    await page.getByTestId('rsf-reset').click();
    await expect(page.getByTestId('simple')).toHaveValue('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
  });

  test('mode=all', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectMode(page, 'all');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('message')).toHaveText('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('simple').focus();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    // submit
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('message')).toHaveText('');
    // fix native error
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('message')).toHaveText('');
    // fix custom error
    await page.getByTestId('simple').fill('foo');
    await expect(page.getByTestId('simple-error')).toHaveText(barError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(barError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(barError);
    await expect(page.getByTestId('message')).toHaveText('');
    // fix global error
    await page.getByTestId('simple').fill('foobar');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).not.toBeFocused();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    await expect(page.getByTestId('message')).toHaveText(submitText);
    // manual reset
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    // reset button
    await page.getByTestId('rsf-reset').click();
    await expect(page.getByTestId('simple')).toHaveValue('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
  });

  test('revalidateMode=change', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectRevalidateMode(page, 'change');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('message')).toHaveText('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('simple').focus();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    // submit
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('message')).toHaveText('');
    // fix native error
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('message')).toHaveText('');
    // fix custom error
    await page.getByTestId('simple').fill('foo');
    await expect(page.getByTestId('simple-error')).toHaveText(barError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(barError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(barError);
    await expect(page.getByTestId('message')).toHaveText('');
    // fix global error
    await page.getByTestId('simple').fill('foobar');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).not.toBeFocused();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    await expect(page.getByTestId('message')).toHaveText(submitText);
    // manual reset
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    // reset button
    await page.getByTestId('rsf-reset').click();
    await expect(page.getByTestId('simple')).toHaveValue('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
  });

  test('revalidateMode=blur', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectRevalidateMode(page, 'blur');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('message')).toHaveText('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('simple').focus();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    // submit
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('message')).toHaveText('');
    // fix native error
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('message')).toHaveText('');
    // fix custom error
    await page.getByTestId('simple').fill('foo');
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(barError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(barError);
    await expect(page.getByTestId('message')).toHaveText('');
    // fix global error
    await page.getByTestId('simple').fill('foobar');
    await expect(page.getByTestId('simple-error')).toHaveText(barError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).not.toBeFocused();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    await expect(page.getByTestId('message')).toHaveText(submitText);
    // manual reset
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    // reset button
    await page.getByTestId('rsf-reset').click();
    await expect(page.getByTestId('simple')).toHaveValue('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
  });
});
