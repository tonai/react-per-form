'use client';

import type { ReactElement } from 'react';

import { FormProvider, Reset, Submit, useForm } from '@per-form/react';
import { useMemo, useRef, useState } from 'react';

import Filters from '../../components/Filters/Filters';
import { handleSubmit } from '../../helpers/form';
import { dynamicValidator } from '../../helpers/validators';
import { useFilters } from '../../hooks/useFilters';

const messages = {
  valueMissing: 'Did you miss something ?',
};

export default function HookDynamicForm(): ReactElement {
  const { filtersProps, formData } = useFilters();
  const ref = useRef(0);
  const [ids, setIds] = useState<number[]>([]);
  const validators = useMemo(
    () => ({
      dynamic: {
        names: ids.map((id) => `dynamic-${id}`),
        validator: dynamicValidator,
      },
    }),
    [ids],
  );
  const { formProps, ...context } = useForm({
    ...formData,
    messages,
    validators,
  });
  const { errors, onSubmit } = context;

  function handleAdd(): void {
    setIds(ids.concat(ref.current));
    ref.current++;
  }

  function handleRemove(id: number): void {
    setIds(ids.filter((i) => i !== id));
  }

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
          <button data-testid="dynamic-add" onClick={handleAdd} type="button">
            Add
          </button>
          {ids.map((id) => (
            <div key={id} className="field">
              <label htmlFor="file">dynamic {id}</label>
              <div className="input">
                <div>
                  <input
                    autoComplete="off"
                    data-testid={`dynamic-${id}`}
                    name={`dynamic-${id}`}
                    required
                    type="number"
                  />
                  <button
                    className="inline"
                    data-testid={`dynamic-${id}-remove`}
                    onClick={() => handleRemove(id)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
                {Boolean(errors.native[`dynamic-${id}`]) && (
                  <div className="error" data-testid={`dynamic-${id}-error`}>
                    {errors.native[`dynamic-${id}`]}
                  </div>
                )}
              </div>
            </div>
          ))}
          {Boolean(errors.validator.dynamic) && (
            <div className="error" data-testid="dynamic-validator-error">
              {errors.validator.dynamic.error}
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
