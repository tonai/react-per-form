import { useId, useMemo } from 'react';
import { IFormValues, useInputs } from 'react-form-validation';

function doubleValidator(values: IFormValues, names: string[]) {
  if (values[names[0]] === '' || values[names[1]] === '') {
    return '';
  }
  return Number(values[names[0]]) < Number(values[names[1]])
    ? ''
    : 'Second value must be greater than first value';
}

function Double() {
  const id1 = useId();
  const id2 = useId();
  const names = useMemo(() => [id1, id2], [id1, id2]);
  const { errors } = useInputs({ names, validator: doubleValidator });

  return (
    <div>
      <div>
        <input autoComplete="off" name={id1} required type="number" />
        {errors.all?.[id1] && (
          <div style={{ color: 'red' }}>{errors.native[id1]}</div>
        )}
      </div>
      <div>
        <input autoComplete="off" name={id2} required type="number" />
        {errors.all?.[id2] && (
          <div style={{ color: 'red' }}>{errors.native[id2]}</div>
        )}
      </div>
      {errors.validator?.double && (
        <div style={{ color: 'red' }}>{errors.validator.double.error}</div>
      )}
    </div>
  );
}

export default Double;
