import { Reset, Submit, formContext, useForm } from 'react-form-validation';
import Filters from '../../components/Filters/Filters';
import { fooValidator, globalFooValidator } from '../../helpers/validators';
import { useFilters } from '../../hooks/useFilters';

const messages = {
  valueMissing: 'Did you miss something ?',
};

const validators = {
  foo: fooValidator,
  foobar: { validator: globalFooValidator, names: ['foo'] },
};

export default function HookSimpleForm() {
  const { filtersProps, hookProps } = useFilters();
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
          <div className="field">
            <label htmlFor="file">simple</label>
            <div className="input">
              <input
                autoComplete="off"
                data-testid="simple"
                name="foo"
                required
              />
              {errors.all?.foo && (
                <div className="error" data-testid="simple-error">
                  {errors.all.foo}
                </div>
              )}
            </div>
          </div>
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
