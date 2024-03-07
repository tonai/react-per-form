import { useId } from 'react';
import { useInput } from 'react-form-validation';
import { fooValidator } from '../../helpers/validators';

function Input(props: JSX.IntrinsicElements['input']) {
  const id = useId();
  const { error } = useInput({
    name: props.name ?? id,
    validator: fooValidator,
  });

  return (
    <div>
      <input autoComplete="off" data-testid="simple" name={id} {...props} />
      {error && (
        <div className="error" data-testid="simple-error">
          {error.error}
        </div>
      )}
    </div>
  );
}

export default Input;
