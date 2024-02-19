import { useMemo, useRef, useState } from 'react';
import {
  IFormProps,
  IFormValues,
  Reset,
  Submit,
  formContext,
  useForm,
} from 'react-form-validation';

function fooValidator(value: IFormValues) {
  return String(value.foo).includes('foo')
    ? ''
    : 'Value does not include "foo"';
}

function doubleValidator(values: IFormValues, names: string[]) {
  if (values[names[0]] === '' || values[names[1]] === '') {
    return '';
  }
  return Number(values[names[0]]) < Number(values[names[1]])
    ? ''
    : 'Second value must be greater than first value';
}

function dynamicValidator(values: IFormValues) {
  return Object.values(values).reduce((a, b) => Number(a) + Number(b), 0) === 12
    ? ''
    : 'The sum must be equal to 12';
}

function globalValidatorMultiple(values: IFormValues) {
  return String(values.foo).includes('bar')
    ? ''
    : 'Value should also contains "bar"';
}

const messages = {
  valueMissing: 'Did you miss something ?',
};

export default function NativeForm(props: Omit<IFormProps, 'children'>) {
  const ref = useRef(0);
  const [ids, setIds] = useState<number[]>([]);
  const validators = useMemo(
    () => ({
      foo: fooValidator,
      foobar: { validator: globalValidatorMultiple, names: ['foo'] },
      double: { validator: doubleValidator, names: ['double1', 'double2'] },
      dynamic: {
        validator: dynamicValidator,
        names: ids.map((id) => `dynamic-${id}`),
      },
    }),
    [ids],
  );
  const { formProps, ...context } = useForm({
    ...props,
    messages,
    validators,
  });
  const { errors } = context;

  function handleAdd() {
    setIds(ids.concat(ref.current));
    ref.current++;
  }

  function handleRemove(id: number) {
    setIds(ids.filter((i) => i !== id));
  }

  return (
    <formContext.Provider value={context}>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        {...formProps}
      >
        <div>
          <input autoComplete="off" name="foo" required />
          {errors.all?.foo && (
            <div style={{ color: 'red' }}>{errors.all.foo}</div>
          )}
        </div>
        <div>
          <div>
            <input autoComplete="off" name="double1" required type="number" />
            {errors.native?.double1 && (
              <div style={{ color: 'red' }}>{errors.native.double1}</div>
            )}
          </div>
          <div>
            <input autoComplete="off" name="double2" required type="number" />
            {errors.native?.double2 && (
              <div style={{ color: 'red' }}>{errors.native.double2}</div>
            )}
          </div>
          {errors.validator?.double && (
            <div style={{ color: 'red' }}>{errors.validator.double.error}</div>
          )}
        </div>
        <div>
          <button onClick={handleAdd} type="button">
            Add
          </button>
          {ids.map((id) => (
            <div key={id}>
              <input
                autoComplete="off"
                name={`dynamic-${id}`}
                required
                type="number"
              />
              <button
                className="inline"
                onClick={() => handleRemove(id)}
                type="button"
              >
                Remove
              </button>
              {errors.native?.[`dynamic-${id}`] && (
                <div style={{ color: 'red' }}>
                  {errors.native?.[`dynamic-${id}`]}
                </div>
              )}
            </div>
          ))}
          {errors.validator?.dynamic && (
            <div style={{ color: 'red' }}>{errors.validator.dynamic.error}</div>
          )}
        </div>
        <div>
          <Reset />
        </div>
        <div>
          <Submit />
        </div>
        <div>
          <Submit disableOnError />
        </div>
      </form>
    </formContext.Provider>
  );
}
