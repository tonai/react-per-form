import { useInputs } from 'react-form-validation';
import { doubleValidator } from '../../helpers/validators';

const names = ['double-1', 'double-2'];

function Double() {
  const { errors } = useInputs({
    id: 'double',
    names,
    validators: doubleValidator,
  });

  return (
    <>
      <div className="field">
        <label htmlFor="file">double 1</label>
        <div className="input">
          <input
            autoComplete="off"
            data-testid="double-1"
            name="double-1"
            required
            type="number"
          />
          {errors.all?.['double-1'] && (
            <div className="error" data-testid="double-1-error">
              {errors.native['double-1']}
            </div>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="file">double 2</label>
        <div className="input">
          <input
            autoComplete="off"
            data-testid="double-2"
            name="double-2"
            required
            type="number"
          />
          {errors.all?.['double-2'] && (
            <div className="error" data-testid="double-2-error">
              {errors.native['double-2']}
            </div>
          )}
        </div>
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
