import { useMemo } from 'react';
import { Reset, Submit, formContext, useForm } from 'react-form-validation';
import Filters from '../../components/Filters/Filters';
import { doubleValidator } from '../../helpers/validators';
import { useFilters } from '../../hooks/useFilters';

const messages = {
  valueMissing: 'Did you miss something ?',
};

export default function HookDoubleForm() {
  const { filtersProps, hookProps } = useFilters();
  const validators = useMemo(
    () => ({
      double: { validator: doubleValidator, names: ['double1', 'double2'] },
    }),
    [],
  );
  const { formProps, ...context } = useForm({
    ...hookProps,
    messages,
    validators,
  });
  const { errors } = context;

  return (
    <>
      <Filters {...filtersProps} />
      <formContext.Provider value={context}>
        <form className="form" data-testid="form" {...formProps}>
          <div>
            <input
              autoComplete="off"
              data-testid="double-1"
              name="double1"
              required
              type="number"
            />
            {errors.native?.double1 && (
              <div className="error" data-testid="double-1-error">
                {errors.native.double1}
              </div>
            )}
          </div>
          <div>
            <input
              autoComplete="off"
              data-testid="double-2"
              name="double2"
              required
              type="number"
            />
            {errors.native?.double2 && (
              <div className="error" data-testid="double-1-error">
                {errors.native.double2}
              </div>
            )}
          </div>
          {errors.validator?.double && (
            <div className="error" data-testid="double-validator-error">
              {errors.validator.double.error}
            </div>
          )}
          <div className="form__actions">
            <Reset />
            <Submit />
            <Submit data-testid="rfv-submit-disabled" disableOnError />
          </div>
        </form>
      </formContext.Provider>
    </>
  );
}
