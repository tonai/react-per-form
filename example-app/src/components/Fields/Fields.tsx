import { useInputs } from 'react-form-validation';
import {
  colorValidator,
  radioValidator,
  rangeValidator,
} from '../../helpers/validators';

const names = [
  'checkbox',
  'color',
  'date',
  'datetime-local',
  'email',
  'file',
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
  'datalist',
  'textarea',
];
const validators = {
  color: colorValidator,
  radio: radioValidator,
  range: rangeValidator,
};

function Fields() {
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
            type="checkbox"
            autoComplete="off"
            data-testid="checkbox"
            name="checkbox"
            id="checkbox"
            required
          />
          {errors.all.checkbox && (
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
            type="color"
            autoComplete="off"
            data-testid="color"
            name="color"
            id="color"
            required
          />
          {errors.all.color && (
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
            type="date"
            autoComplete="off"
            data-testid="date"
            name="date"
            id="date"
            required
          />
          {errors.all.date && (
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
            type="datetime-local"
            autoComplete="off"
            data-testid="datetime-local"
            name="datetime-local"
            id="datetime-local"
            required
          />
          {errors.all['datetime-local'] && (
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
            type="email"
            autoComplete="off"
            data-testid="email"
            name="email"
            id="email"
            required
          />
          {errors.all.email && (
            <div className="error" data-testid="email-error">
              {errors.all.email}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="file">file</label>
        <div className="input">
          <input
            type="file"
            autoComplete="off"
            data-testid="file"
            name="file"
            id="file"
            required
          />
          {errors.all.file && (
            <div className="error" data-testid="file-error">
              {errors.all.file}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="month">month</label>
        <div className="input">
          <input
            type="month"
            autoComplete="off"
            data-testid="month"
            name="month"
            id="month"
            required
          />
          {errors.all.month && (
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
            type="number"
            autoComplete="off"
            data-testid="number"
            name="number"
            id="number"
            required
          />
          {errors.all.number && (
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
            type="password"
            autoComplete="off"
            data-testid="password"
            name="password"
            id="password"
            required
          />
          {errors.all.password && (
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
              type="radio"
              autoComplete="off"
              data-testid="radio-1"
              name="radio"
              id="radio"
              value="1"
              required
            />
            <input
              type="radio"
              autoComplete="off"
              data-testid="radio-2"
              name="radio"
              value="2"
              required
            />
            <input
              type="radio"
              autoComplete="off"
              data-testid="radio-3"
              name="radio"
              value="3"
              required
            />
          </div>
          {errors.all.radio && (
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
            type="range"
            autoComplete="off"
            data-testid="range"
            name="range"
            id="range"
          />
          {errors.all.range && (
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
            type="search"
            autoComplete="off"
            data-testid="search"
            name="search"
            id="search"
            required
          />
          {errors.all.search && (
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
            type="tel"
            autoComplete="off"
            data-testid="tel"
            name="tel"
            id="tel"
            required
          />
          {errors.all.tel && (
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
            type="text"
            autoComplete="off"
            data-testid="text"
            name="text"
            id="text"
            required
          />
          {errors.all.text && (
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
            type="time"
            autoComplete="off"
            data-testid="time"
            name="time"
            id="time"
            required
          />
          {errors.all.time && (
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
            type="url"
            autoComplete="off"
            data-testid="url"
            name="url"
            id="url"
            required
          />
          {errors.all.url && (
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
            type="week"
            autoComplete="off"
            data-testid="week"
            name="week"
            id="week"
            required
          />
          {errors.all.week && (
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
            name="select"
            id="select"
            required
          >
            <option value=""></option>
            <option value="option 1">option 1</option>
            <option value="option 2">option 2</option>
            <option value="option 3">option 3</option>
          </select>
          {errors.all.select && (
            <div className="error" data-testid="select-error">
              {errors.all.select}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="datalist">datalist</label>
        <div className="input">
          <input
            type="text"
            autoComplete="off"
            data-testid="datalist"
            name="datalist"
            id="datalist"
            list="datalist-list"
            required
          />
          <datalist id="datalist-list">
            <option value=""></option>
            <option value="option 1">option 1</option>
            <option value="option 2">option 2</option>
            <option value="option 3">option 3</option>
          </datalist>
          {errors.all.datalist && (
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
            name="textarea"
            id="textarea"
            required
          />
          {errors.all.textarea && (
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
