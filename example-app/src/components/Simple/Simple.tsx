import { useId } from 'react';
import { useInput } from 'react-form-validation';
import { fooValidator } from '../../helpers/validators';

function Simple(props: JSX.IntrinsicElements['input']) {
  const id = useId();
  const { error } = useInput({
    name: props.name ?? id,
    validators: fooValidator,
  });

  return (
    <div className="field">
      <label htmlFor="file">simple</label>
      <div className="input">
        <input autoComplete="off" data-testid="simple" name={id} {...props} />
        {error && (
          <div className="error" data-testid="simple-error">
            {error.error}
          </div>
        )}
      </div>
    </div>
  );
}

export default Simple;
