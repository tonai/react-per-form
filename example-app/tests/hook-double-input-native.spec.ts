import { expect, test } from '@playwright/test';
import { getErrorMessage, goto, submitMsg } from './helpers';

const url = '/hook-double';
const missError = 'Did you miss something ?';
const validatorError = 'Second value must be greater than first value';

test.describe('Hook Double Input Native', () => {
  // For native errors, we cannot detect whether the error message is displayed or not.
  // We also don't know if the reportValidity function was called or not.
  // So we can't really test the different modes, which is why we only test the submit mode here.
  test('mode=submit', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    expect(await getErrorMessage(page, 'double-1')).toEqual(missError);
    expect(await getErrorMessage(page, 'double-2')).toEqual(missError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    // focus and blur
    await page.getByTestId('double-1').focus();
    await page.getByTestId('double-1').blur();
    expect(await getErrorMessage(page, 'double-1')).toEqual(missError);
    expect(await getErrorMessage(page, 'double-2')).toEqual(missError);
    await page.getByTestId('double-1').fill('5');
    expect(await getErrorMessage(page, 'double-1')).toEqual('');
    expect(await getErrorMessage(page, 'double-2')).toEqual(missError);
    await page.getByTestId('double-1').blur();
    expect(await getErrorMessage(page, 'double-1')).toEqual('');
    expect(await getErrorMessage(page, 'double-2')).toEqual(missError);
    await page.getByTestId('double-1').fill('');
    expect(await getErrorMessage(page, 'double-1')).toEqual(missError);
    expect(await getErrorMessage(page, 'double-2')).toEqual(missError);
    await page.getByTestId('double-1').blur();
    expect(await getErrorMessage(page, 'double-1')).toEqual(missError);
    expect(await getErrorMessage(page, 'double-2')).toEqual(missError);
    // submit
    await page.getByTestId('rfv-submit').click();
    expect(await getErrorMessage(page, 'double-1')).toEqual(missError);
    expect(await getErrorMessage(page, 'double-2')).toEqual(missError);
    // fix native error 1
    await page.getByTestId('double-1').fill('5');
    expect(await getErrorMessage(page, 'double-1')).toEqual('');
    expect(await getErrorMessage(page, 'double-2')).toEqual(missError);
    await page.getByTestId('double-1').blur();
    expect(await getErrorMessage(page, 'double-1')).toEqual('');
    expect(await getErrorMessage(page, 'double-2')).toEqual(missError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(await getErrorMessage(page, 'double-1')).toEqual('');
    expect(await getErrorMessage(page, 'double-2')).toEqual(missError);
    // fix native error 2
    await page.getByTestId('double-2').fill('3');
    expect(await getErrorMessage(page, 'double-1')).toEqual(validatorError);
    expect(await getErrorMessage(page, 'double-2')).toEqual('');
    await page.getByTestId('double-2').blur();
    expect(await getErrorMessage(page, 'double-1')).toEqual(validatorError);
    expect(await getErrorMessage(page, 'double-2')).toEqual('');
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    expect(await getErrorMessage(page, 'double-1')).toEqual(validatorError);
    expect(await getErrorMessage(page, 'double-2')).toEqual('');
    // fix validator error
    await page.getByTestId('double-2').fill('7');
    expect(await getErrorMessage(page, 'double-1')).toEqual('');
    expect(await getErrorMessage(page, 'double-2')).toEqual('');
    await page.getByTestId('double-2').blur();
    expect(await getErrorMessage(page, 'double-1')).toEqual('');
    expect(await getErrorMessage(page, 'double-2')).toEqual('');
    await expect(page.getByTestId('rfv-submit-disabled')).toBeEnabled();
    await page.getByTestId('rfv-submit').click();
    expect(await getErrorMessage(page, 'double-1')).toEqual('');
    expect(await getErrorMessage(page, 'double-2')).toEqual('');
    expect(await consoleMsg).toEqual(submitMsg);
    // manual reset
    await page.getByTestId('double-1').fill('');
    expect(await getErrorMessage(page, 'double-1')).toEqual(missError);
    expect(await getErrorMessage(page, 'double-2')).toEqual('');
    await page.getByTestId('double-1').blur();
    expect(await getErrorMessage(page, 'double-1')).toEqual(missError);
    expect(await getErrorMessage(page, 'double-2')).toEqual('');
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('double-1').fill('5');
    await page.getByTestId('double-1').blur();
    // reset button
    await page.getByTestId('rfv-reset').click();
    await expect(page.getByTestId('double-1')).toHaveValue('');
    await expect(page.getByTestId('double-2')).toHaveValue('');
    expect(await getErrorMessage(page, 'double-1')).toEqual(missError);
    expect(await getErrorMessage(page, 'double-2')).toEqual(missError);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
  });
});
