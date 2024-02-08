import { useId } from 'react';
import { IValidator, useInput } from 'react-form-validation';

type InputProps = JSX.IntrinsicElements['input'];

interface IInputProps extends InputProps {
  validator?: IValidator;
}

function Input(props: IInputProps) {
  const { validator, ...inputProps } = props;
  const id = useId();
  const { error, ref } = useInput({ name: id, validator });

  return (
    <div>
      <input name={id} {...inputProps} ref={ref} />
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default Input;
