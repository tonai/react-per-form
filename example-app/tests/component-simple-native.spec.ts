import { expect, test } from '@playwright/test';

import { getErrorMessage, goto } from './helpers';

const url = '/component-simple';
const missError = 'Did you miss something ?';
const fooError = 'Value does not include "foo"';
const barError = 'Value should also contains "bar"';
const submitText = 'the last value submitted is "foobar"';

test.describe('Component Simple Native', () => {
  // For native errors, we cannot detect whether the error message is displayed or not.
  // We also don't know if the reportValidity function was called or not.
  // So we can't really test the different modes, which is why we only test the submit mode here.
  test('mode=submit', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    expect(await getErrorMessage(page, 'simple')).toEqual(missError);
    await expect(page.getByTestId('message')).toHaveText('');
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
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
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    expect(await getErrorMessage(page, 'simple')).toEqual(missError);
    await expect(page.getByTestId('message')).toHaveText('');
    // fix native error
    await page.getByTestId('simple').fill('f');
    expect(await getErrorMessage(page, 'simple')).toEqual(fooError);
    await page.getByTestId('simple').blur();
    expect(await getErrorMessage(page, 'simple')).toEqual(fooError);
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    expect(await getErrorMessage(page, 'simple')).toEqual(fooError);
    await expect(page.getByTestId('message')).toHaveText('');
    // fix custom error
    await page.getByTestId('simple').fill('foo');
    expect(await getErrorMessage(page, 'simple')).toEqual(barError);
    await page.getByTestId('simple').blur();
    expect(await getErrorMessage(page, 'simple')).toEqual(barError);
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('simple')).toBeFocused();
    expect(await getErrorMessage(page, 'simple')).toEqual(barError);
    await expect(page.getByTestId('message')).toHaveText('');
    // fix global error
    await page.getByTestId('simple').fill('foobar');
    expect(await getErrorMessage(page, 'simple')).toEqual('');
    await page.getByTestId('simple').blur();
    expect(await getErrorMessage(page, 'simple')).toEqual('');
    await expect(page.getByTestId('rpf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rpf-submit').click();
    expect(page.getByTestId('simple')).not.toBeFocused();
    expect(await getErrorMessage(page, 'simple')).toEqual('');
    expect(await consoleMsg).toBe(true);
    await expect(page.getByTestId('message')).toContainText(submitText);
    // manual reset
    await page.getByTestId('simple').fill('');
    expect(await getErrorMessage(page, 'simple')).toEqual(missError);
    await page.getByTestId('simple').blur();
    expect(await getErrorMessage(page, 'simple')).toEqual(missError);
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    // reset button
    await page.getByTestId('rpf-reset').click();
    await expect(page.getByTestId('simple')).toHaveValue('');
    expect(await getErrorMessage(page, 'simple')).toEqual(missError);
    await expect(page.getByTestId('rpf-submit-disabled')).toBeDisabled();
  });
});
