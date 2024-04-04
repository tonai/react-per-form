import { Reset, Submit, formContext, useForm } from 'react-swift-form';
import Filters from '../../components/Filters/Filters';
import { doubleValidator } from '../../helpers/validators';
import { useFilters } from '../../hooks/useFilters';
import { handleSubmit } from '../../helpers/form';

const messages = {
  valueMissing: 'Did you miss something ?',
};
const validators = {
  double: { validator: doubleValidator, names: ['double1', 'double2'] },
};

export default function HookDoubleForm() {
  const { filtersProps, formData } = useFilters();
  const { formProps, ...context } = useForm({
    ...formData,
    messages,
    validators,
  });
  const { errors, onSubmit } = context;

  return (
    <>
      <Filters {...filtersProps} />
      <formContext.Provider value={context}>
        <form
          {...formProps}
          className="form"
          data-testid="form"
          onSubmit={onSubmit(handleSubmit)}
        >
          <div className="field">
            <label htmlFor="file">double 1</label>
            <div className="input">
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
          </div>
          <div className="field">
            <label htmlFor="file">double 2</label>
            <div className="input">
              <input
                autoComplete="off"
                data-testid="double-2"
                name="double2"
                required
                type="number"
              />
              {errors.native?.double2 && (
                <div className="error" data-testid="double-2-error">
                  {errors.native.double2}
                </div>
              )}
            </div>
          </div>
          {errors.validator?.double?.error && (
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
