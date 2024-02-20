import { expect, test } from '@playwright/test';
import { disableNativeValidation, goto, selectMode } from './helpers';

test.describe('Native Simple Input', () => {
  test('non native, mode=none', async ({ page }) => {
    const { consoleMsg } = await goto(page, '/');
    await disableNativeValidation(page);
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
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
    await page.getByTestId('rfv-submit').click();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Did you miss something ?',
    );
    // fix native error
    await page.getByTestId('simple').fill('f');
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Did you miss something ?',
    );
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value does not include "foo"',
    );
    // fix custom error
    await page.getByTestId('simple').fill('foo');
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value does not include "foo"',
    );
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value should also contains "bar"',
    );
    // fix global error
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value should also contains "bar"',
    );
    await expect(page.getByTestId('rfv-submit-disabled')).toBeEnabled();
    await page.getByTestId('rfv-submit').click();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    expect(await consoleMsg).toEqual('Submit!');
    // manual reset
    await page.getByTestId('simple').fill('');
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    // reset button
    await page.getByTestId('rfv-reset').click();
    await expect(page.getByTestId('simple')).toHaveValue('');
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
  });

  test('non native, mode=fix', async ({ page }) => {
    const { consoleMsg } = await goto(page, '/');
    await disableNativeValidation(page);
    await selectMode(page, 'fix');
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
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
    await page.getByTestId('rfv-submit').click();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Did you miss something ?',
    );
    // fix native error
    await page.getByTestId('simple').fill('f');
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value does not include "foo"',
    );
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value does not include "foo"',
    );
    // fix custom error
    await page.getByTestId('simple').fill('foo');
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value should also contains "bar"',
    );
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value should also contains "bar"',
    );
    // fix global error
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeEnabled();
    await page.getByTestId('rfv-submit').click();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    expect(await consoleMsg).toEqual('Submit!');
    // manual reset
    await page.getByTestId('simple').fill('');
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    // reset button
    await page.getByTestId('rfv-reset').click();
    await expect(page.getByTestId('simple')).toHaveValue('');
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
  });

  test('non native, mode=change', async ({ page }) => {
    const { consoleMsg } = await goto(page, '/');
    await disableNativeValidation(page);
    await selectMode(page, 'change');
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    // focus and blur
    await page.getByTestId('simple').focus();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value does not include "foo"',
    );
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value does not include "foo"',
    );
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Did you miss something ?',
    );
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Did you miss something ?',
    );
    // submit
    await page.getByTestId('rfv-submit').click();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Did you miss something ?',
    );
    // fix native error
    await page.getByTestId('simple').fill('f');
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value does not include "foo"',
    );
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value does not include "foo"',
    );
    // fix custom error
    await page.getByTestId('simple').fill('foo');
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value should also contains "bar"',
    );
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value should also contains "bar"',
    );
    // fix global error
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeEnabled();
    await page.getByTestId('rfv-submit').click();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    expect(await consoleMsg).toEqual('Submit!');
    // manual reset
    await page.getByTestId('simple').fill('');
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Did you miss something ?',
    );
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    // reset button
    await page.getByTestId('rfv-reset').click();
    await expect(page.getByTestId('simple')).toHaveValue('');
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
  });

  test('non native, mode=blur', async ({ page }) => {
    const { consoleMsg } = await goto(page, '/');
    await disableNativeValidation(page);
    await selectMode(page, 'blur');
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    // focus and blur
    await page.getByTestId('simple').focus();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Did you miss something ?',
    );
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Did you miss something ?',
    );
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value does not include "foo"',
    );
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value does not include "foo"',
    );
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Did you miss something ?',
    );
    // submit
    await page.getByTestId('rfv-submit').click();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Did you miss something ?',
    );
    // fix native error
    await page.getByTestId('simple').fill('f');
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value does not include "foo"',
    );
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value does not include "foo"',
    );
    // fix custom error
    await page.getByTestId('simple').fill('foo');
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value should also contains "bar"',
    );
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value should also contains "bar"',
    );
    // fix global error
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeEnabled();
    await page.getByTestId('rfv-submit').click();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    expect(await consoleMsg).toEqual('Submit!');
    // manual reset
    await page.getByTestId('simple').fill('');
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Did you miss something ?',
    );
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    // reset button
    await page.getByTestId('rfv-reset').click();
    await expect(page.getByTestId('simple')).toHaveValue('');
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
  });

  test('non native, mode=check', async ({ page }) => {
    const { consoleMsg } = await goto(page, '/');
    await disableNativeValidation(page);
    await selectMode(page, 'check');
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    // focus and blur
    await page.getByTestId('simple').focus();
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Did you miss something ?',
    );
    await page.getByTestId('simple').fill('f');
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value does not include "foo"',
    );
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value does not include "foo"',
    );
    await page.getByTestId('simple').fill('');
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Did you miss something ?',
    );
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Did you miss something ?',
    );
    // submit
    await page.getByTestId('rfv-submit').click();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Did you miss something ?',
    );
    // fix native error
    await page.getByTestId('simple').fill('f');
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value does not include "foo"',
    );
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value does not include "foo"',
    );
    // fix custom error
    await page.getByTestId('simple').fill('foo');
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value should also contains "bar"',
    );
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await page.getByTestId('rfv-submit').click();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Value should also contains "bar"',
    );
    // fix global error
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeEnabled();
    await page.getByTestId('rfv-submit').click();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
    expect(await consoleMsg).toEqual('Submit!');
    // manual reset
    await page.getByTestId('simple').fill('');
    await page.getByTestId('simple').blur();
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await expect(page.getByTestId('simple-error')).toHaveText(
      'Did you miss something ?',
    );
    await page.getByTestId('simple').fill('foobar');
    await page.getByTestId('simple').blur();
    // reset button
    await page.getByTestId('rfv-reset').click();
    await expect(page.getByTestId('simple')).toHaveValue('');
    await expect(page.getByTestId('rfv-submit-disabled')).toBeDisabled();
    await expect(page.getByTestId('simple-error')).not.toBeVisible();
  });
});
