/* eslint-disable @typescript-eslint/no-unnecessary-condition */

'use client';

import type { ReactElement } from 'react';

import { FormProvider, Reset, Submit, useForm } from '@per-form/react';

import Filters from '../../components/Filters/Filters';
import { handleSubmit } from '../../helpers/form';
import { doubleValidator } from '../../helpers/validators';
import { useFilters } from '../../hooks/useFilters';

const messages = {
  valueMissing: 'Did you miss something ?',
};
const validators = {
  double: { names: ['double1', 'double2'], validator: doubleValidator },
};

export default function HookDoubleForm(): ReactElement {
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
            <label htmlFor="file">double 1</label>
            <div className="input">
              <input
                autoComplete="off"
                data-testid="double-1"
                name="double1"
                required
                type="number"
              />
              {Boolean(errors.native.double1) && (
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
              {Boolean(errors.native.double2) && (
                <div className="error" data-testid="double-2-error">
                  {errors.native.double2}
                </div>
              )}
            </div>
          </div>
          {Boolean(errors.validator.double?.error) && (
            <div className="error" data-testid="double-validator-error">
              {errors.validator.double?.error}
            </div>
          )}
          <div className="form__actions">
            <Reset />
            <Submit />
            <Submit data-testid="rpf-submit-disabled" disableOnError />
          </div>
        </form>
      </FormProvider>
    </>
  );
}
