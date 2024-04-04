import { expect, test } from '@playwright/test';
import { getErrorMessage, goto } from './helpers';

const url = '/';
const missError = 'Did you miss something ?';
const fooError = 'Value does not include "foo"';
const barError = 'Value should also contains "bar"';

test.describe('Hook Simple Native', () => {
  // For native errors, we cannot detect whether the error message is displayed or not.
  // We also don't know if the reportValidity function was called or not.
  // So we can't really test the different modes, which is why we only test the submit mode here.
  test('mode=submit', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    expect(await getErrorMessage(page, 'simple')).toEqual(missError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('simple').focus();
    await page.getByTestId('simple').blur();
    expect(await getErrorMessage(page, 'simple')).toEqual(missError);
    await page.getByTestId('simple').fill('f');
    expect(await getErrorMessage(page, 'simple')).toEqual(fooError);
    await page.getByTestId('simple').blur();
    expect(await getErrorMessage(page, 'simple')).toEqual(fooError);
    await page.getByTestId('simple').fill('');
    expect(await getErrorMessage(page, 'simple')).toEqual(missError);
    await page.getByTestId('simple').blur();
    expect(await getErrorMessage(page, 'simple')).toEqual(missError);
    // submit
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    expect(await getErrorMessage(page, 'simple')).toEqual(missError);
    // fix native error
    await page.getByTestId('simple').fill('f');
    expect(await getErrorMessage(page, 'simple')).toEqual(fooError);
    await page.getByTestId('simple').blur();
    expect(await getErrorMessage(page, 'simple')).toEqual(fooError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    expect(await getErrorMessage(page, 'simple')).toEqual(fooError);
    // fix custom error
    await page.getByTestId('simple').fill('foo');
    expect(await getErrorMessage(page, 'simple')).toEqual(barError);
    await page.getByTestId('simple').blur();
    expect(await getErrorMessage(page, 'simple')).toEqual(barError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    expect(await getErrorMessage(page, 'simple')).toEqual(barError);
    // fix global error
    await page.getByTestId('simple').fill('foobar');
    expect(await getErrorMessage(page, 'simple')).toEqual('');
    await page.getByTestId('simple').blur();
    expect(await getErrorMessage(page, 'simple')).toEqual('');
    await expect(page.getByTestId('rsf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('simple')).not.toBeFocused();
    expect(await getErrorMessage(page, 'simple')).toEqual('');
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('simple').fill('');
    expect(await getErrorMessage(page, 'simple')).toEqual(missError);
    await page.getByTestId('simple').blur();
    expect(await getErrorMessage(page, 'simple')).toEqual(missError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    // reset button
    await page.getByTestId('rsf-reset').click();
    await expect(page.getByTestId('simple')).toHaveValue('');
    expect(await getErrorMessage(page, 'simple')).toEqual(missError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
  });
});
