import { useId, useMemo } from 'react';
import { useInputs } from 'react-form-validation';
import { doubleValidator } from '../../helpers/validators';

function Double() {
  const id1 = useId();
  const id2 = useId();
  const names = useMemo(() => [id1, id2], [id1, id2]);
  const { errors } = useInputs({ names, validator: doubleValidator });

  return (
    <>
      <div>
        <input
          autoComplete="off"
          data-testid="double-1"
          name={id1}
          required
          type="number"
        />
        {errors.all?.[id1] && (
          <div className="error" data-testid="double-1-error">
            {errors.native[id1]}
          </div>
        )}
      </div>
      <div>
        <input
          autoComplete="off"
          data-testid="double-2"
          name={id2}
          required
          type="number"
        />
        {errors.all?.[id2] && (
          <div className="error" data-testid="double-2-error">
            {errors.native[id2]}
          </div>
        )}
      </div>
      {errors.validator?.double && (
        <div className="error" data-testid="double-validator-error">
          {errors.validator.double.error}
        </div>
      )}
    </>
  );
}

export default Double;
