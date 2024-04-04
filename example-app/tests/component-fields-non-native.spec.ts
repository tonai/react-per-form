import { expect, test } from '@playwright/test';
import {
  disableNativeValidation,
  getErrorMessage,
  goto,
  selectMode,
  setFile,
} from './helpers';

const url = '/component-fields';
const file = './logo.svg';
const missError = 'Did you miss something ?';
const colorError = 'The red part should be greater than 200';
const radioError = 'Select the third value';
const rangeError = 'The value should be greater than 75';
const multipleError = 'Select at least two options';

test.describe('Component Fields Non Native', () => {
  // Only test the all mode for now (other modes are tested in other pages)
  test('mode=all', async ({ page }) => {
    const { consoleMsg } = await goto(page, url);
    await disableNativeValidation(page);
    await selectMode(page, 'all');
    await expect(page.getByTestId('checkbox-error')).not.toBeVisible();
    await expect(page.getByTestId('color-error')).not.toBeVisible();
    await expect(page.getByTestId('date-error')).not.toBeVisible();
    await expect(page.getByTestId('datetime-local-error')).not.toBeVisible();
    await expect(page.getByTestId('email-error')).not.toBeVisible();
    await expect(page.getByTestId('email-multiple-error')).not.toBeVisible();
    await expect(page.getByTestId('file-error')).not.toBeVisible();
    await expect(page.getByTestId('file-multiple-error')).not.toBeVisible();
    await expect(page.getByTestId('month-error')).not.toBeVisible();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('password-error')).not.toBeVisible();
    await expect(page.getByTestId('radio-error')).not.toBeVisible();
    await expect(page.getByTestId('range-error')).not.toBeVisible();
    await expect(page.getByTestId('search-error')).not.toBeVisible();
    await expect(page.getByTestId('tel-error')).not.toBeVisible();
    await expect(page.getByTestId('text-error')).not.toBeVisible();
    await expect(page.getByTestId('time-error')).not.toBeVisible();
    await expect(page.getByTestId('url-error')).not.toBeVisible();
    await expect(page.getByTestId('week-error')).not.toBeVisible();
    await expect(page.getByTestId('select-error')).not.toBeVisible();
    await expect(page.getByTestId('select-multiple-error')).not.toBeVisible();
    await expect(page.getByTestId('datalist-error')).not.toBeVisible();
    await expect(page.getByTestId('textarea-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    // checkbox
    await page.getByTestId('checkbox').focus();
    await page.getByTestId('checkbox').blur();
    await expect(page.getByTestId('checkbox-error')).toHaveText(missError);
    await page.getByTestId('checkbox').check();
    await expect(page.getByTestId('checkbox-error')).not.toBeVisible();
    await page.getByTestId('checkbox').blur();
    await expect(page.getByTestId('checkbox-error')).not.toBeVisible();
    await page.getByTestId('checkbox').uncheck();
    await expect(page.getByTestId('checkbox-error')).toHaveText(missError);
    await page.getByTestId('checkbox').blur();
    await expect(page.getByTestId('checkbox-error')).toHaveText(missError);
    // color
    await page.getByTestId('color').focus();
    await page.getByTestId('color').blur();
    await expect(page.getByTestId('color-error')).toHaveText(colorError);
    await page.getByTestId('color').fill('#ffffff');
    await expect(page.getByTestId('color-error')).not.toBeVisible();
    await page.getByTestId('color').blur();
    await expect(page.getByTestId('color-error')).not.toBeVisible();
    await page.getByTestId('color').fill('#000000');
    await expect(page.getByTestId('color-error')).toHaveText(colorError);
    await page.getByTestId('color').blur();
    await expect(page.getByTestId('color-error')).toHaveText(colorError);
    // date
    await page.getByTestId('date').focus();
    await page.getByTestId('date').blur();
    await expect(page.getByTestId('date-error')).toHaveText(missError);
    await page.getByTestId('date').fill('2024-01-01');
    await expect(page.getByTestId('date-error')).not.toBeVisible();
    await page.getByTestId('date').blur();
    await expect(page.getByTestId('date-error')).not.toBeVisible();
    await page.getByTestId('date').fill('');
    await expect(page.getByTestId('date-error')).toHaveText(missError);
    await page.getByTestId('date').blur();
    await expect(page.getByTestId('date-error')).toHaveText(missError);
    // datetime-local
    await page.getByTestId('datetime-local').focus();
    await page.getByTestId('datetime-local').blur();
    await expect(page.getByTestId('datetime-local-error')).toHaveText(
      missError,
    );
    await page.getByTestId('datetime-local').fill('2024-01-01T00:00');
    await expect(page.getByTestId('datetime-local-error')).not.toBeVisible();
    await page.getByTestId('datetime-local').blur();
    await expect(page.getByTestId('datetime-local-error')).not.toBeVisible();
    await page.getByTestId('datetime-local').fill('');
    await expect(page.getByTestId('datetime-local-error')).toHaveText(
      missError,
    );
    await page.getByTestId('datetime-local').blur();
    await expect(page.getByTestId('datetime-local-error')).toHaveText(
      missError,
    );
    // email
    await page.getByTestId('email').focus();
    await page.getByTestId('email').blur();
    await expect(page.getByTestId('email-error')).toHaveText(missError);
    await page.getByTestId('email').fill('foo@bar');
    await expect(page.getByTestId('email-error')).not.toBeVisible();
    await page.getByTestId('email').blur();
    await expect(page.getByTestId('email-error')).not.toBeVisible();
    await page.getByTestId('email').fill('');
    await expect(page.getByTestId('email-error')).toHaveText(missError);
    await page.getByTestId('email').blur();
    await expect(page.getByTestId('email-error')).toHaveText(missError);
    // email-multiple
    await page.getByTestId('email-multiple').focus();
    await page.getByTestId('email-multiple').blur();
    await expect(page.getByTestId('email-multiple-error')).toHaveText(
      missError,
    );
    await page.getByTestId('email-multiple').fill('foo@bar');
    await expect(page.getByTestId('email-multiple-error')).toHaveText(
      multipleError,
    );
    await page.getByTestId('email-multiple').blur();
    await expect(page.getByTestId('email-multiple-error')).toHaveText(
      multipleError,
    );
    await page.getByTestId('email-multiple').fill('');
    await expect(page.getByTestId('email-multiple-error')).toHaveText(
      missError,
    );
    await page.getByTestId('email-multiple').blur();
    await expect(page.getByTestId('email-multiple-error')).toHaveText(
      missError,
    );
    // file
    await page.getByTestId('file').focus();
    await page.getByTestId('file').blur();
    await expect(page.getByTestId('file-error')).toHaveText(missError);
    await setFile(page, 'file', file);
    await expect(page.getByTestId('file-error')).not.toBeVisible();
    await page.getByTestId('file').blur();
    await expect(page.getByTestId('file-error')).not.toBeVisible();
    await setFile(page, 'file', []);
    await expect(page.getByTestId('file-error')).toHaveText(missError);
    await page.getByTestId('file').blur();
    await expect(page.getByTestId('file-error')).toHaveText(missError);
    // file-multiple
    await page.getByTestId('file-multiple').focus();
    await page.getByTestId('file-multiple').blur();
    await expect(page.getByTestId('file-multiple-error')).toHaveText(missError);
    await setFile(page, 'file-multiple', file);
    await expect(page.getByTestId('file-multiple-error')).toHaveText(
      multipleError,
    );
    await page.getByTestId('file-multiple').blur();
    await expect(page.getByTestId('file-multiple-error')).toHaveText(
      multipleError,
    );
    await setFile(page, 'file-multiple', []);
    await expect(page.getByTestId('file-multiple-error')).toHaveText(missError);
    await page.getByTestId('file-multiple').blur();
    await expect(page.getByTestId('file-multiple-error')).toHaveText(missError);
    // month
    await page.getByTestId('month').focus();
    await page.getByTestId('month').blur();
    await expect(page.getByTestId('month-error')).toHaveText(missError);
    await page.getByTestId('month').fill('2024-01');
    await expect(page.getByTestId('month-error')).not.toBeVisible();
    await page.getByTestId('month').blur();
    await expect(page.getByTestId('month-error')).not.toBeVisible();
    await page.getByTestId('month').fill('');
    await expect(page.getByTestId('month-error')).toHaveText(missError);
    await page.getByTestId('month').blur();
    await expect(page.getByTestId('month-error')).toHaveText(missError);
    // number
    await page.getByTestId('number').focus();
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await page.getByTestId('number').fill('42');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await page.getByTestId('number').fill('');
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    // password
    await page.getByTestId('password').focus();
    await page.getByTestId('password').blur();
    await expect(page.getByTestId('password-error')).toHaveText(missError);
    await page.getByTestId('password').fill('password');
    await expect(page.getByTestId('password-error')).not.toBeVisible();
    await page.getByTestId('password').blur();
    await expect(page.getByTestId('password-error')).not.toBeVisible();
    await page.getByTestId('password').fill('');
    await expect(page.getByTestId('password-error')).toHaveText(missError);
    await page.getByTestId('password').blur();
    await expect(page.getByTestId('password-error')).toHaveText(missError);
    // radio
    await page.getByTestId('radio-1').focus();
    await page.getByTestId('radio-1').blur();
    await expect(page.getByTestId('radio-error')).toHaveText(missError);
    await page.getByTestId('radio-1').check();
    await expect(page.getByTestId('radio-error')).toHaveText(radioError);
    await page.getByTestId('radio-1').blur();
    await expect(page.getByTestId('radio-error')).toHaveText(radioError);
    // range
    await page.getByTestId('range').focus();
    await page.getByTestId('range').blur();
    await expect(page.getByTestId('range-error')).toHaveText(rangeError);
    await page.getByTestId('range').fill('80');
    await expect(page.getByTestId('range-error')).not.toBeVisible();
    await page.getByTestId('range').blur();
    await expect(page.getByTestId('range-error')).not.toBeVisible();
    await page.getByTestId('range').fill('50');
    await expect(page.getByTestId('range-error')).toHaveText(rangeError);
    await page.getByTestId('range').blur();
    await expect(page.getByTestId('range-error')).toHaveText(rangeError);
    // search
    await page.getByTestId('search').focus();
    await page.getByTestId('search').blur();
    await expect(page.getByTestId('search-error')).toHaveText(missError);
    await page.getByTestId('search').fill('search');
    await expect(page.getByTestId('search-error')).not.toBeVisible();
    await page.getByTestId('search').blur();
    await expect(page.getByTestId('search-error')).not.toBeVisible();
    await page.getByTestId('search').fill('');
    await expect(page.getByTestId('search-error')).toHaveText(missError);
    await page.getByTestId('search').blur();
    await expect(page.getByTestId('search-error')).toHaveText(missError);
    // tel
    await page.getByTestId('tel').focus();
    await page.getByTestId('tel').blur();
    await expect(page.getByTestId('tel-error')).toHaveText(missError);
    await page.getByTestId('tel').fill('00');
    await expect(page.getByTestId('tel-error')).not.toBeVisible();
    await page.getByTestId('tel').blur();
    await expect(page.getByTestId('tel-error')).not.toBeVisible();
    await page.getByTestId('tel').fill('');
    await expect(page.getByTestId('tel-error')).toHaveText(missError);
    await page.getByTestId('tel').blur();
    await expect(page.getByTestId('tel-error')).toHaveText(missError);
    // text
    await page.getByTestId('text').focus();
    await page.getByTestId('text').blur();
    await expect(page.getByTestId('text-error')).toHaveText(missError);
    await page.getByTestId('text').fill('text');
    await expect(page.getByTestId('text-error')).not.toBeVisible();
    await page.getByTestId('text').blur();
    await expect(page.getByTestId('text-error')).not.toBeVisible();
    await page.getByTestId('text').fill('');
    await expect(page.getByTestId('text-error')).toHaveText(missError);
    await page.getByTestId('text').blur();
    await expect(page.getByTestId('text-error')).toHaveText(missError);
    // time
    await page.getByTestId('time').focus();
    await page.getByTestId('time').blur();
    await expect(page.getByTestId('time-error')).toHaveText(missError);
    await page.getByTestId('time').fill('00:00');
    await expect(page.getByTestId('time-error')).not.toBeVisible();
    await page.getByTestId('time').blur();
    await expect(page.getByTestId('time-error')).not.toBeVisible();
    await page.getByTestId('time').fill('');
    await expect(page.getByTestId('time-error')).toHaveText(missError);
    await page.getByTestId('time').blur();
    await expect(page.getByTestId('time-error')).toHaveText(missError);
    // url
    await page.getByTestId('url').focus();
    await page.getByTestId('url').blur();
    await expect(page.getByTestId('url-error')).toHaveText(missError);
    await page.getByTestId('url').fill('http://localhost');
    await expect(page.getByTestId('url-error')).not.toBeVisible();
    await page.getByTestId('url').blur();
    await expect(page.getByTestId('url-error')).not.toBeVisible();
    await page.getByTestId('url').fill('');
    await expect(page.getByTestId('url-error')).toHaveText(missError);
    await page.getByTestId('url').blur();
    await expect(page.getByTestId('url-error')).toHaveText(missError);
    // week
    await page.getByTestId('week').focus();
    await page.getByTestId('week').blur();
    await expect(page.getByTestId('week-error')).toHaveText(missError);
    await page.getByTestId('week').fill('2024-W01');
    await expect(page.getByTestId('week-error')).not.toBeVisible();
    await page.getByTestId('week').blur();
    await expect(page.getByTestId('week-error')).not.toBeVisible();
    await page.getByTestId('week').fill('');
    await expect(page.getByTestId('week-error')).toHaveText(missError);
    await page.getByTestId('week').blur();
    await expect(page.getByTestId('week-error')).toHaveText(missError);
    // select
    await page.getByTestId('select').focus();
    await page.getByTestId('select').blur();
    await expect(page.getByTestId('select-error')).toHaveText(missError);
    await page.getByTestId('select').selectOption('option 1');
    await expect(page.getByTestId('select-error')).not.toBeVisible();
    await page.getByTestId('select').blur();
    await expect(page.getByTestId('select-error')).not.toBeVisible();
    await page.getByTestId('select').selectOption('');
    await expect(page.getByTestId('select-error')).toHaveText(missError);
    await page.getByTestId('select').blur();
    await expect(page.getByTestId('select-error')).toHaveText(missError);
    // select-multiple
    await page.getByTestId('select-multiple').focus();
    await page.getByTestId('select-multiple').blur();
    await expect(page.getByTestId('select-multiple-error')).toHaveText(
      missError,
    );
    await page.getByTestId('select-multiple').selectOption('option 1');
    await expect(page.getByTestId('select-multiple-error')).toHaveText(
      multipleError,
    );
    await page.getByTestId('select-multiple').blur();
    await expect(page.getByTestId('select-multiple-error')).toHaveText(
      multipleError,
    );
    await page.getByTestId('select-multiple').selectOption([]);
    await expect(page.getByTestId('select-multiple-error')).toHaveText(
      missError,
    );
    await page.getByTestId('select-multiple').blur();
    await expect(page.getByTestId('select-multiple-error')).toHaveText(
      missError,
    );
    // datalist
    await page.getByTestId('datalist').focus();
    await page.getByTestId('datalist').blur();
    await expect(page.getByTestId('datalist-error')).toHaveText(missError);
    await page.getByTestId('datalist').fill('option 1');
    await expect(page.getByTestId('datalist-error')).not.toBeVisible();
    await page.getByTestId('datalist').blur();
    await expect(page.getByTestId('datalist-error')).not.toBeVisible();
    await page.getByTestId('datalist').fill('');
    await expect(page.getByTestId('datalist-error')).toHaveText(missError);
    await page.getByTestId('datalist').blur();
    await expect(page.getByTestId('datalist-error')).toHaveText(missError);
    // textarea
    await page.getByTestId('textarea').focus();
    await page.getByTestId('textarea').blur();
    await expect(page.getByTestId('textarea-error')).toHaveText(missError);
    await page.getByTestId('textarea').fill('textarea');
    await expect(page.getByTestId('textarea-error')).not.toBeVisible();
    await page.getByTestId('textarea').blur();
    await expect(page.getByTestId('textarea-error')).not.toBeVisible();
    await page.getByTestId('textarea').fill('');
    await expect(page.getByTestId('textarea-error')).toHaveText(missError);
    await page.getByTestId('textarea').blur();
    await expect(page.getByTestId('textarea-error')).toHaveText(missError);
    // submit
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('checkbox')).toBeFocused();
    await expect(page.getByTestId('checkbox-error')).toHaveText(missError);
    await expect(page.getByTestId('color-error')).toHaveText(colorError);
    await expect(page.getByTestId('date-error')).toHaveText(missError);
    await expect(page.getByTestId('datetime-local-error')).toHaveText(
      missError,
    );
    await expect(page.getByTestId('email-error')).toHaveText(missError);
    await expect(page.getByTestId('email-multiple-error')).toHaveText(
      missError,
    );
    await expect(page.getByTestId('file-error')).toHaveText(missError);
    await expect(page.getByTestId('file-multiple-error')).toHaveText(missError);
    await expect(page.getByTestId('month-error')).toHaveText(missError);
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await expect(page.getByTestId('password-error')).toHaveText(missError);
    await expect(page.getByTestId('radio-error')).toHaveText(radioError);
    await expect(page.getByTestId('range-error')).toHaveText(rangeError);
    await expect(page.getByTestId('search-error')).toHaveText(missError);
    await expect(page.getByTestId('tel-error')).toHaveText(missError);
    await expect(page.getByTestId('text-error')).toHaveText(missError);
    await expect(page.getByTestId('time-error')).toHaveText(missError);
    await expect(page.getByTestId('url-error')).toHaveText(missError);
    await expect(page.getByTestId('week-error')).toHaveText(missError);
    await expect(page.getByTestId('select-error')).toHaveText(missError);
    await expect(page.getByTestId('select-multiple-error')).toHaveText(
      missError,
    );
    await expect(page.getByTestId('datalist-error')).toHaveText(missError);
    await expect(page.getByTestId('textarea-error')).toHaveText(missError);
    // fix error
    await page.getByTestId('checkbox').check();
    await expect(page.getByTestId('checkbox-error')).not.toBeVisible();
    await page.getByTestId('checkbox').blur();
    await expect(page.getByTestId('checkbox-error')).not.toBeVisible();
    await page.getByTestId('color').fill('#ffffff');
    await expect(page.getByTestId('color-error')).not.toBeVisible();
    await page.getByTestId('color').blur();
    await expect(page.getByTestId('color-error')).not.toBeVisible();
    await page.getByTestId('date').fill('2024-01-01');
    await expect(page.getByTestId('date-error')).not.toBeVisible();
    await page.getByTestId('date').blur();
    await expect(page.getByTestId('date-error')).not.toBeVisible();
    await page.getByTestId('datetime-local').fill('2024-01-01T00:00');
    await expect(page.getByTestId('datetime-local-error')).not.toBeVisible();
    await page.getByTestId('datetime-local').blur();
    await expect(page.getByTestId('datetime-local-error')).not.toBeVisible();
    await page.getByTestId('email').fill('foo@bar');
    await expect(page.getByTestId('email-error')).not.toBeVisible();
    await page.getByTestId('email').blur();
    await expect(page.getByTestId('email-error')).not.toBeVisible();
    await page.getByTestId('email-multiple').fill('foo@bar, bar@baz');
    await expect(page.getByTestId('email-multiple-error')).not.toBeVisible();
    await page.getByTestId('email-multiple').blur();
    await expect(page.getByTestId('email-multiple-error')).not.toBeVisible();
    await setFile(page, 'file', file);
    await expect(page.getByTestId('file-error')).not.toBeVisible();
    await page.getByTestId('file').blur();
    await expect(page.getByTestId('file-error')).not.toBeVisible();
    await setFile(page, 'file-multiple', [file, file]);
    await expect(page.getByTestId('file-multiple-error')).not.toBeVisible();
    await page.getByTestId('file-multiple').blur();
    await expect(page.getByTestId('file-multiple-error')).not.toBeVisible();
    await page.getByTestId('month').fill('2024-01');
    await expect(page.getByTestId('month-error')).not.toBeVisible();
    await page.getByTestId('month').blur();
    await expect(page.getByTestId('month-error')).not.toBeVisible();
    await page.getByTestId('number').fill('42');
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await page.getByTestId('password').fill('password');
    await expect(page.getByTestId('password-error')).not.toBeVisible();
    await page.getByTestId('password').blur();
    await expect(page.getByTestId('password-error')).not.toBeVisible();
    await page.getByTestId('radio-3').check();
    await expect(page.getByTestId('radio-error')).not.toBeVisible();
    await page.getByTestId('radio-3').blur();
    await expect(page.getByTestId('radio-error')).not.toBeVisible();
    await page.getByTestId('range').fill('80');
    await expect(page.getByTestId('range-error')).not.toBeVisible();
    await page.getByTestId('range').blur();
    await expect(page.getByTestId('range-error')).not.toBeVisible();
    await page.getByTestId('search').fill('search');
    await expect(page.getByTestId('search-error')).not.toBeVisible();
    await page.getByTestId('search').blur();
    await expect(page.getByTestId('search-error')).not.toBeVisible();
    await page.getByTestId('tel').fill('00');
    await expect(page.getByTestId('tel-error')).not.toBeVisible();
    await page.getByTestId('tel').blur();
    await expect(page.getByTestId('tel-error')).not.toBeVisible();
    await page.getByTestId('text').fill('text');
    await expect(page.getByTestId('text-error')).not.toBeVisible();
    await page.getByTestId('text').blur();
    await expect(page.getByTestId('text-error')).not.toBeVisible();
    await page.getByTestId('time').fill('00:00');
    await expect(page.getByTestId('time-error')).not.toBeVisible();
    await page.getByTestId('time').blur();
    await expect(page.getByTestId('time-error')).not.toBeVisible();
    await page.getByTestId('url').fill('http://localhost');
    await expect(page.getByTestId('url-error')).not.toBeVisible();
    await page.getByTestId('url').blur();
    await expect(page.getByTestId('url-error')).not.toBeVisible();
    await page.getByTestId('week').fill('2024-W01');
    await expect(page.getByTestId('week-error')).not.toBeVisible();
    await page.getByTestId('week').blur();
    await expect(page.getByTestId('week-error')).not.toBeVisible();
    await page.getByTestId('select').selectOption('option 1');
    await expect(page.getByTestId('select-error')).not.toBeVisible();
    await page.getByTestId('select').blur();
    await expect(page.getByTestId('select-error')).not.toBeVisible();
    await page
      .getByTestId('select-multiple')
      .selectOption(['option 1', 'option 2']);
    await expect(page.getByTestId('select-multiple-error')).not.toBeVisible();
    await page.getByTestId('select-multiple').blur();
    await expect(page.getByTestId('select-multiple-error')).not.toBeVisible();
    await page.getByTestId('datalist').fill('option 1');
    await expect(page.getByTestId('datalist-error')).not.toBeVisible();
    await page.getByTestId('datalist').blur();
    await expect(page.getByTestId('datalist-error')).not.toBeVisible();
    await page.getByTestId('textarea').fill('textarea');
    await expect(page.getByTestId('textarea-error')).not.toBeVisible();
    await page.getByTestId('textarea').blur();
    await expect(page.getByTestId('textarea-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeEnabled();
    await page.getByTestId('rsf-submit').click();
    expect(page.getByTestId('checkbox')).not.toBeFocused();
    await expect(page.getByTestId('checkbox-error')).not.toBeVisible();
    await expect(page.getByTestId('color-error')).not.toBeVisible();
    await expect(page.getByTestId('date-error')).not.toBeVisible();
    await expect(page.getByTestId('datetime-local-error')).not.toBeVisible();
    await expect(page.getByTestId('email-error')).not.toBeVisible();
    await expect(page.getByTestId('email-multiple-error')).not.toBeVisible();
    await expect(page.getByTestId('file-error')).not.toBeVisible();
    await expect(page.getByTestId('file-multiple-error')).not.toBeVisible();
    await expect(page.getByTestId('month-error')).not.toBeVisible();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('password-error')).not.toBeVisible();
    await expect(page.getByTestId('radio-error')).not.toBeVisible();
    await expect(page.getByTestId('range-error')).not.toBeVisible();
    await expect(page.getByTestId('search-error')).not.toBeVisible();
    await expect(page.getByTestId('tel-error')).not.toBeVisible();
    await expect(page.getByTestId('text-error')).not.toBeVisible();
    await expect(page.getByTestId('time-error')).not.toBeVisible();
    await expect(page.getByTestId('url-error')).not.toBeVisible();
    await expect(page.getByTestId('week-error')).not.toBeVisible();
    await expect(page.getByTestId('select-error')).not.toBeVisible();
    await expect(page.getByTestId('select-multiple-error')).not.toBeVisible();
    await expect(page.getByTestId('datalist-error')).not.toBeVisible();
    await expect(page.getByTestId('textarea-error')).not.toBeVisible();
    expect(await consoleMsg).toBe(true);
    // manual reset
    await page.getByTestId('checkbox').uncheck();
    await expect(page.getByTestId('checkbox-error')).toHaveText(missError);
    await page.getByTestId('checkbox').blur();
    await expect(page.getByTestId('checkbox-error')).toHaveText(missError);
    await page.getByTestId('color').fill('#000000');
    await expect(page.getByTestId('color-error')).toHaveText(colorError);
    await page.getByTestId('color').blur();
    await expect(page.getByTestId('color-error')).toHaveText(colorError);
    await page.getByTestId('date').fill('');
    await expect(page.getByTestId('date-error')).toHaveText(missError);
    await page.getByTestId('date').blur();
    await expect(page.getByTestId('date-error')).toHaveText(missError);
    await page.getByTestId('datetime-local').fill('');
    await expect(page.getByTestId('datetime-local-error')).toHaveText(
      missError,
    );
    await page.getByTestId('datetime-local').blur();
    await expect(page.getByTestId('datetime-local-error')).toHaveText(
      missError,
    );
    await page.getByTestId('email').fill('');
    await expect(page.getByTestId('email-error')).toHaveText(missError);
    await page.getByTestId('email').blur();
    await expect(page.getByTestId('email-error')).toHaveText(missError);
    await page.getByTestId('email-multiple').fill('');
    await expect(page.getByTestId('email-multiple-error')).toHaveText(
      missError,
    );
    await page.getByTestId('email-multiple').blur();
    await expect(page.getByTestId('email-multiple-error')).toHaveText(
      missError,
    );
    await setFile(page, 'file', []);
    await expect(page.getByTestId('file-error')).toHaveText(missError);
    await page.getByTestId('file').blur();
    await expect(page.getByTestId('file-error')).toHaveText(missError);
    await setFile(page, 'file-multiple', []);
    await expect(page.getByTestId('file-multiple-error')).toHaveText(missError);
    await page.getByTestId('file-multiple').blur();
    await expect(page.getByTestId('file-multiple-error')).toHaveText(missError);
    await page.getByTestId('month').fill('');
    await expect(page.getByTestId('month-error')).toHaveText(missError);
    await page.getByTestId('month').blur();
    await expect(page.getByTestId('month-error')).toHaveText(missError);
    await page.getByTestId('number').fill('');
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await page.getByTestId('number').blur();
    await expect(page.getByTestId('number-error')).toHaveText(missError);
    await page.getByTestId('password').fill('');
    await expect(page.getByTestId('password-error')).toHaveText(missError);
    await page.getByTestId('password').blur();
    await expect(page.getByTestId('password-error')).toHaveText(missError);
    await page.getByTestId('radio-1').check();
    expect(await getErrorMessage(page, 'radio-1')).toEqual(radioError);
    await expect(page.getByTestId('radio-error')).toHaveText(radioError);
    await page.getByTestId('radio-1').blur();
    await expect(page.getByTestId('radio-error')).toHaveText(radioError);
    await page.getByTestId('range').fill('50');
    await expect(page.getByTestId('range-error')).toHaveText(rangeError);
    await page.getByTestId('range').blur();
    await expect(page.getByTestId('range-error')).toHaveText(rangeError);
    await page.getByTestId('search').fill('');
    await expect(page.getByTestId('search-error')).toHaveText(missError);
    await page.getByTestId('search').blur();
    await expect(page.getByTestId('search-error')).toHaveText(missError);
    await page.getByTestId('tel').fill('');
    await expect(page.getByTestId('tel-error')).toHaveText(missError);
    await page.getByTestId('tel').blur();
    await expect(page.getByTestId('tel-error')).toHaveText(missError);
    await page.getByTestId('text').fill('');
    await expect(page.getByTestId('text-error')).toHaveText(missError);
    await page.getByTestId('text').blur();
    await expect(page.getByTestId('text-error')).toHaveText(missError);
    await page.getByTestId('time').fill('');
    await expect(page.getByTestId('time-error')).toHaveText(missError);
    await page.getByTestId('time').blur();
    await expect(page.getByTestId('time-error')).toHaveText(missError);
    await page.getByTestId('url').fill('');
    await expect(page.getByTestId('url-error')).toHaveText(missError);
    await page.getByTestId('url').blur();
    await expect(page.getByTestId('url-error')).toHaveText(missError);
    await page.getByTestId('week').fill('');
    await expect(page.getByTestId('week-error')).toHaveText(missError);
    await page.getByTestId('week').blur();
    await expect(page.getByTestId('week-error')).toHaveText(missError);
    await page.getByTestId('select').selectOption('');
    await expect(page.getByTestId('select-error')).toHaveText(missError);
    await page.getByTestId('select').blur();
    await expect(page.getByTestId('select-error')).toHaveText(missError);
    await page.getByTestId('select-multiple').selectOption([]);
    await expect(page.getByTestId('select-multiple-error')).toHaveText(
      missError,
    );
    await page.getByTestId('select-multiple').blur();
    await expect(page.getByTestId('select-multiple-error')).toHaveText(
      missError,
    );
    await page.getByTestId('datalist').fill('');
    await expect(page.getByTestId('datalist-error')).toHaveText(missError);
    await page.getByTestId('datalist').blur();
    await expect(page.getByTestId('datalist-error')).toHaveText(missError);
    await page.getByTestId('textarea').fill('');
    await expect(page.getByTestId('textarea-error')).toHaveText(missError);
    await page.getByTestId('textarea').blur();
    await expect(page.getByTestId('textarea-error')).toHaveText(missError);
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
    await page.getByTestId('checkbox').check();
    await page.getByTestId('color').fill('#ffffff');
    await page.getByTestId('date').fill('2024-01-01');
    await page.getByTestId('datetime-local').fill('2024-01-01T00:00');
    await page.getByTestId('email').fill('foo@bar');
    await page.getByTestId('email-multiple').fill('foo@bar, bar@baz');
    await setFile(page, 'file', file);
    await setFile(page, 'file-multiple', file);
    await page.getByTestId('month').fill('2024-01');
    await page.getByTestId('number').fill('42');
    await page.getByTestId('password').fill('password');
    await page.getByTestId('radio-3').check();
    await page.getByTestId('range').fill('80');
    await page.getByTestId('search').fill('search');
    await page.getByTestId('tel').fill('00');
    await page.getByTestId('text').fill('text');
    await page.getByTestId('time').fill('00:00');
    await page.getByTestId('url').fill('http://localhost');
    await page.getByTestId('week').fill('2024-W01');
    await page.getByTestId('select').selectOption('option 1');
    await page.getByTestId('select-multiple').selectOption('option 1');
    await page.getByTestId('datalist').fill('option 1');
    await page.getByTestId('textarea').fill('textarea');
    // reset button
    await page.getByTestId('rsf-reset').click();
    await expect(page.getByTestId('checkbox')).not.toBeChecked();
    await expect(page.getByTestId('color')).toHaveValue('#000000');
    await expect(page.getByTestId('date')).toHaveValue('');
    await expect(page.getByTestId('datetime-local')).toHaveValue('');
    await expect(page.getByTestId('email')).toHaveValue('');
    await expect(page.getByTestId('email-multiple')).toHaveValue('');
    await expect(page.getByTestId('file')).toHaveValue('');
    await expect(page.getByTestId('file-multiple')).toHaveValue('');
    await expect(page.getByTestId('month')).toHaveValue('');
    await expect(page.getByTestId('number')).toHaveValue('');
    await expect(page.getByTestId('password')).toHaveValue('');
    await expect(page.getByTestId('radio-3')).not.toBeChecked();
    await expect(page.getByTestId('range')).toHaveValue('50');
    await expect(page.getByTestId('search')).toHaveValue('');
    await expect(page.getByTestId('tel')).toHaveValue('');
    await expect(page.getByTestId('text')).toHaveValue('');
    await expect(page.getByTestId('time')).toHaveValue('');
    await expect(page.getByTestId('url')).toHaveValue('');
    await expect(page.getByTestId('week')).toHaveValue('');
    await expect(page.getByTestId('select')).toHaveValue('');
    await expect(page.getByTestId('select-multiple')).toHaveValue('');
    await expect(page.getByTestId('datalist')).toHaveValue('');
    await expect(page.getByTestId('textarea')).toHaveValue('');
    await expect(page.getByTestId('checkbox-error')).not.toBeVisible();
    await expect(page.getByTestId('color-error')).not.toBeVisible();
    await expect(page.getByTestId('date-error')).not.toBeVisible();
    await expect(page.getByTestId('datetime-local-error')).not.toBeVisible();
    await expect(page.getByTestId('email-error')).not.toBeVisible();
    await expect(page.getByTestId('email-multiple-error')).not.toBeVisible();
    await expect(page.getByTestId('file-error')).not.toBeVisible();
    await expect(page.getByTestId('file-multiple-error')).not.toBeVisible();
    await expect(page.getByTestId('month-error')).not.toBeVisible();
    await expect(page.getByTestId('number-error')).not.toBeVisible();
    await expect(page.getByTestId('password-error')).not.toBeVisible();
    await expect(page.getByTestId('radio-error')).not.toBeVisible();
    await expect(page.getByTestId('range-error')).not.toBeVisible();
    await expect(page.getByTestId('search-error')).not.toBeVisible();
    await expect(page.getByTestId('tel-error')).not.toBeVisible();
    await expect(page.getByTestId('text-error')).not.toBeVisible();
    await expect(page.getByTestId('time-error')).not.toBeVisible();
    await expect(page.getByTestId('url-error')).not.toBeVisible();
    await expect(page.getByTestId('week-error')).not.toBeVisible();
    await expect(page.getByTestId('select-error')).not.toBeVisible();
    await expect(page.getByTestId('select-multiple-error')).not.toBeVisible();
    await expect(page.getByTestId('datalist-error')).not.toBeVisible();
    await expect(page.getByTestId('textarea-error')).not.toBeVisible();
    await expect(page.getByTestId('rsf-submit-disabled')).toBeDisabled();
  });
});
