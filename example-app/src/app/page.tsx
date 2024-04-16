'use client';

import type { ReactElement } from 'react';

import { useFormState } from 'react-dom';
import { FormProvider, Reset, Submit, useForm } from 'react-swift-form';

import { serverAction } from '../actions';
import Filters from '../components/Filters/Filters';
import Loader from '../components/Loader/Loader';
import { handleSubmit } from '../helpers/form';
import { fooValidator, globalFooValidator } from '../helpers/validators';
import { useFilters } from '../hooks/useFilters';

const initialState = {
  message: '',
};

const messages = {
  valueMissing: 'Did you miss something ?',
};

const validators = {
  foo: fooValidator,
  foobar: { names: ['foo'], validator: globalFooValidator },
};

export default function HookSimpleForm(): ReactElement {
  const [state, formAction] = useFormState(serverAction, initialState);
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
          action={formAction}
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
              {Boolean(errors.all.foo) && (
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
            <Loader />
          </div>
          <p
            aria-live="polite"
            className="sr-only"
            data-testid="message"
            role="status"
          >
            {state.message}
          </p>
        </form>
      </FormProvider>
    </>
  );
}
