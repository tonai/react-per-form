'use client';

import type { ReactElement } from 'react';

import { useInputs } from 'react-swift-form';

import {
  colorValidator,
  multipleValidator,
  radioValidator,
  rangeValidator,
} from '../../helpers/validators';

const names = [
  'checkbox',
  'color',
  'date',
  'datetime-local',
  'email',
  'email-multiple',
  'file',
  'file-multiple',
  'month',
  'number',
  'password',
  'radio',
  'range',
  'search',
  'tel',
  'text',
  'time',
  'url',
  'week',
  'select',
  'select-multiple',
  'datalist',
  'textarea',
];
const validators = {
  color: colorValidator,
  'email-multiple': multipleValidator('email-multiple'),
  'file-multiple': multipleValidator('file-multiple'),
  radio: radioValidator,
  range: rangeValidator,
  'select-multiple': multipleValidator('select-multiple'),
};

function Fields(): ReactElement {
  const { errors } = useInputs({
    names,
    validators,
  });

  return (
    <>
      <div className="field">
        <label htmlFor="checkbox">checkbox</label>
        <div className="input">
          <input
            autoComplete="off"
            data-testid="checkbox"
            id="checkbox"
            name="checkbox"
            required
            type="checkbox"
          />
          {Boolean(errors.all.checkbox) && (
            <div className="error" data-testid="checkbox-error">
              {errors.all.checkbox}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="color">color</label>
        <div className="input">
          <input
            autoComplete="off"
            data-testid="color"
            id="color"
            name="color"
            required
            type="color"
          />
          {Boolean(errors.all.color) && (
            <div className="error" data-testid="color-error">
              {errors.all.color}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="date">date</label>
        <div className="input">
          <input
            autoComplete="off"
            data-testid="date"
            id="date"
            name="date"
            required
            type="date"
          />
          {Boolean(errors.all.date) && (
            <div className="error" data-testid="date-error">
              {errors.all.date}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="datetime-local">datetime-local</label>
        <div className="input">
          <input
            autoComplete="off"
            data-testid="datetime-local"
            id="datetime-local"
            name="datetime-local"
            required
            type="datetime-local"
          />
          {Boolean(errors.all['datetime-local']) && (
            <div className="error" data-testid="datetime-local-error">
              {errors.all['datetime-local']}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="email">email</label>
        <div className="input">
          <input
            autoComplete="off"
            data-testid="email"
            id="email"
            name="email"
            required
            type="email"
          />
          {Boolean(errors.all.email) && (
            <div className="error" data-testid="email-error">
              {errors.all.email}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="email-multiple">email-multiple</label>
        <div className="input">
          <input
            autoComplete="off"
            data-testid="email-multiple"
            id="email-multiple"
            multiple
            name="email-multiple"
            required
            type="email"
          />
          {Boolean(errors.all['email-multiple']) && (
            <div className="error" data-testid="email-multiple-error">
              {errors.all['email-multiple']}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="file">file</label>
        <div className="input">
          <input
            autoComplete="off"
            data-testid="file"
            id="file"
            name="file"
            required
            type="file"
          />
          {Boolean(errors.all.file) && (
            <div className="error" data-testid="file-error">
              {errors.all.file}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="file-multiple">file-multiple</label>
        <div className="input">
          <input
            autoComplete="off"
            data-testid="file-multiple"
            id="file-multiple"
            multiple
            name="file-multiple"
            required
            type="file"
          />
          {Boolean(errors.all['file-multiple']) && (
            <div className="error" data-testid="file-multiple-error">
              {errors.all['file-multiple']}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="month">month</label>
        <div className="input">
          <input
            autoComplete="off"
            data-testid="month"
            id="month"
            name="month"
            required
            type="month"
          />
          {Boolean(errors.all.month) && (
            <div className="error" data-testid="month-error">
              {errors.all.month}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="number">number</label>
        <div className="input">
          <input
            autoComplete="off"
            data-testid="number"
            id="number"
            name="number"
            required
            type="number"
          />
          {Boolean(errors.all.number) && (
            <div className="error" data-testid="number-error">
              {errors.all.number}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="password">password</label>
        <div className="input">
          <input
            autoComplete="off"
            data-testid="password"
            id="password"
            name="password"
            required
            type="password"
          />
          {Boolean(errors.all.password) && (
            <div className="error" data-testid="password-error">
              {errors.all.password}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="radio">radio</label>
        <div className="input">
          <div className="radio">
            <input
              autoComplete="off"
              data-testid="radio-1"
              id="radio"
              name="radio"
              required
              type="radio"
              value="1"
            />
            <input
              autoComplete="off"
              data-testid="radio-2"
              name="radio"
              required
              type="radio"
              value="2"
            />
            <input
              autoComplete="off"
              data-testid="radio-3"
              name="radio"
              required
              type="radio"
              value="3"
            />
          </div>
          {Boolean(errors.all.radio) && (
            <div className="error" data-testid="radio-error">
              {errors.all.radio}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="range">range</label>
        <div className="input">
          <input
            autoComplete="off"
            data-testid="range"
            id="range"
            name="range"
            type="range"
          />
          {Boolean(errors.all.range) && (
            <div className="error" data-testid="range-error">
              {errors.all.range}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="search">search</label>
        <div className="input">
          <input
            autoComplete="off"
            data-testid="search"
            id="search"
            name="search"
            required
            type="search"
          />
          {Boolean(errors.all.search) && (
            <div className="error" data-testid="search-error">
              {errors.all.search}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="tel">tel</label>
        <div className="input">
          <input
            autoComplete="off"
            data-testid="tel"
            id="tel"
            name="tel"
            required
            type="tel"
          />
          {Boolean(errors.all.tel) && (
            <div className="error" data-testid="tel-error">
              {errors.all.tel}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="text">text</label>
        <div className="input">
          <input
            autoComplete="off"
            data-testid="text"
            id="text"
            name="text"
            required
            type="text"
          />
          {Boolean(errors.all.text) && (
            <div className="error" data-testid="text-error">
              {errors.all.text}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="time">time</label>
        <div className="input">
          <input
            autoComplete="off"
            data-testid="time"
            id="time"
            name="time"
            required
            type="time"
          />
          {Boolean(errors.all.time) && (
            <div className="error" data-testid="time-error">
              {errors.all.time}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="url">url</label>
        <div className="input">
          <input
            autoComplete="off"
            data-testid="url"
            id="url"
            name="url"
            required
            type="url"
          />
          {Boolean(errors.all.url) && (
            <div className="error" data-testid="url-error">
              {errors.all.url}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="week">week</label>
        <div className="input">
          <input
            autoComplete="off"
            data-testid="week"
            id="week"
            name="week"
            required
            type="week"
          />
          {Boolean(errors.all.week) && (
            <div className="error" data-testid="week-error">
              {errors.all.week}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="select">select</label>
        <div className="input">
          <select
            autoComplete="off"
            data-testid="select"
            id="select"
            name="select"
            required
          >
            <option value="" />
            <option value="option 1">option 1</option>
            <option value="option 2">option 2</option>
            <option value="option 3">option 3</option>
          </select>
          {Boolean(errors.all.select) && (
            <div className="error" data-testid="select-error">
              {errors.all.select}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="select-multiple">select-multiple</label>
        <div className="input">
          <select
            autoComplete="off"
            data-testid="select-multiple"
            id="select-multiple"
            multiple
            name="select-multiple"
            required
          >
            <option value="" />
            <option value="option 1">option 1</option>
            <option value="option 2">option 2</option>
            <option value="option 3">option 3</option>
          </select>
          {Boolean(errors.all['select-multiple']) && (
            <div className="error" data-testid="select-multiple-error">
              {errors.all['select-multiple']}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="datalist">datalist</label>
        <div className="input">
          <input
            autoComplete="off"
            data-testid="datalist"
            id="datalist"
            list="datalist-list"
            name="datalist"
            required
            type="text"
          />
          <datalist id="datalist-list">
            <option value="" />
            <option value="option 1">option 1</option>
            <option value="option 2">option 2</option>
            <option value="option 3">option 3</option>
          </datalist>
          {Boolean(errors.all.datalist) && (
            <div className="error" data-testid="datalist-error">
              {errors.all.datalist}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="textarea">textarea</label>
        <div className="input">
          <textarea
            autoComplete="off"
            data-testid="textarea"
            id="textarea"
            name="textarea"
            required
          />
          {Boolean(errors.all.textarea) && (
            <div className="error" data-testid="textarea-error">
              {errors.all.textarea}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Fields;
