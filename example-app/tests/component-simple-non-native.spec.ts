import { /*  */ expect, test } from '@playwright/test';
import {
  disableNativeValidation,
  goto,
  selectMode,
  selectRevalidateMode,
} from './helpers';

const url = '/component-simple';
const missError = 'Did you miss something ?';
const fooError = 'Value does not include "foo"';
const barError = 'Value should also contains "bar"';

test.describe('Component Simple Non Native', () => {
  test('mode=submit', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('simple').focus();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    // submit
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    // fix native error
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    // fix custom error
    await page.getByTestId('simple').fill('foo');
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).toHaveText(barError);
    // fix global error
    await page.getByTestId('simple').fill('foobar');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).toHaveText(barError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).toHaveText(barError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeEnabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).not.toBeFocused();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    // reset button
    await page.getByTestId('rfv-reset').click();
    await expect(page.getByTestId('simple')).toHaveValue('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
  });

  test('mode=change', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectMode(page, 'change');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('simple').focus();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    // submit
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    // fix native error
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    // fix custom error
    await page.getByTestId('simple').fill('foo');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).toHaveText(barError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).toHaveText(barError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).toHaveText(barError);
    // fix global error
    await page.getByTestId('simple').fill('foobar');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeEnabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).not.toBeFocused();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    // reset button
    await page.getByTestId('rfv-reset').click();
    await expect(page.getByTestId('simple')).toHaveValue('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
  });

  test('mode=blur', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectMode(page, 'blur');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('simple').focus();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    // submit
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    // fix native error
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    // fix custom error
    await page.getByTestId('simple').fill('foo');
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).toHaveText(barError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).toHaveText(barError);
    // fix global error
    await page.getByTestId('simple').fill('foobar');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).toHaveText(barError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeEnabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).not.toBeFocused();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    // reset button
    await page.getByTestId('rfv-reset').click();
    await expect(page.getByTestId('simple')).toHaveValue('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
  });

  test('mode=all', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectMode(page, 'all');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('simple').focus();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    // submit
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    // fix native error
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    // fix custom error
    await page.getByTestId('simple').fill('foo');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).toHaveText(barError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).toHaveText(barError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).toHaveText(barError);
    // fix global error
    await page.getByTestId('simple').fill('foobar');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeEnabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).not.toBeFocused();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    // reset button
    await page.getByTestId('rfv-reset').click();
    await expect(page.getByTestId('simple')).toHaveValue('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
  });

  test('revalidateMode=change', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectRevalidateMode(page, 'change');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('simple').focus();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    // submit
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    // fix native error
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    // fix custom error
    await page.getByTestId('simple').fill('foo');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).toHaveText(barError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).toHaveText(barError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).toHaveText(barError);
    // fix global error
    await page.getByTestId('simple').fill('foobar');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeEnabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).not.toBeFocused();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    // reset button
    await page.getByTestId('rfv-reset').click();
    await expect(page.getByTestId('simple')).toHaveValue('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
  });

  test('revalidateMode=blur', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectRevalidateMode(page, 'blur');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('simple').focus();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    // submit
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    // fix native error
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).toHaveText(missError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    // fix custom error
    await page.getByTestId('simple').fill('foo');
    await expect(page.getByTestId('simple-error')).toHaveText(fooError);
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).toHaveText(barError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).toHaveText(barError);
    // fix global error
    await page.getByTestId('simple').fill('foobar');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).toHaveText(barError);
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeEnabled();
    await page.getByTestId('rfv-submit').click();
    expect(page.getByTestId('simple')).not.toBeFocused();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    // reset button
    await page.getByTestId('rfv-reset').click();
    await expect(page.getByTestId('simple')).toHaveValue('');
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
  });
});
