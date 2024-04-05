import { FormProvider, Reset, Submit, useForm } from 'react-swift-form';
import Filters from '../../components/Filters/Filters';
import { fooValidator, globalFooValidator } from '../../helpers/validators';
import { useFilters } from '../../hooks/useFilters';
import { handleSubmit } from '../../helpers/form';

const messages = {
  valueMissing: 'Did you miss something ?',
};

const validators = {
  foo: fooValidator,
  foobar: { validator: globalFooValidator, names: ['foo'] },
};

export default function HookSimpleForm() {
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
      <FormProvider {...context}>
        <form
          {...formProps}
          className="form"
          data-testid="form"
          onSubmit={onSubmit(handleSubmit)}
        >
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
            <Submit data-testid="rsf-submit-disabled" disableOnError />
          </div>
        </form>
      </FormProvider>
    </>
  );
}
