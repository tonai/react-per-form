import { useId } from 'react';
import { useInput } from 'react-form-validation';

type InputProps = JSX.IntrinsicElements['input'];

function fooValidator(value: FormDataEntryValue | null) {
  return String(value).includes('foo') ? '' : 'Value does not include "foo"';
}

function Input(props: InputProps) {
  const id = useId();
  const { error } = useInput({
    name: props.name ?? id,
    validator: fooValidator,
  });

  return (
    <div>
      <input autoComplete="off" name={id} {...props} />
      {error && <div style={{ color: 'red' }}>{error.error}</div>}
    </div>
  );
}

export default Input;
