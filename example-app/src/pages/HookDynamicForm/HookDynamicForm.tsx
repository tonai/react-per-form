import { useMemo, useRef, useState } from 'react';
import { Reset, Submit, formContext, useForm } from 'react-swift-form';
import Filters from '../../components/Filters/Filters';
import { dynamicValidator } from '../../helpers/validators';
import { useFilters } from '../../hooks/useFilters';
import { handleSubmit } from '../../helpers/form';

const messages = {
  valueMissing: 'Did you miss something ?',
};

export default function HookDynamicForm() {
  const { filtersProps, formData } = useFilters();
  const ref = useRef(0);
  const [ids, setIds] = useState<number[]>([]);
  const validators = useMemo(
    () => ({
      dynamic: {
        validator: dynamicValidator,
        names: ids.map((id) => `dynamic-${id}`),
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

  function handleAdd() {
    setIds(ids.concat(ref.current));
    ref.current++;
  }

  function handleRemove(id: number) {
    setIds(ids.filter((i) => i !== id));
  }

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
                    data-testid={`dynamic-${id}-remove`}
                    className="inline"
                    onClick={() => handleRemove(id)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
                {errors.native?.[`dynamic-${id}`] && (
                  <div className="error" data-testid={`dynamic-${id}-error`}>
                    {errors.native?.[`dynamic-${id}`]}
                  </div>
                )}
              </div>
            </div>
          ))}
          {errors.validator?.dynamic && (
            <div className="error" data-testid="dynamic-validator-error">
              {errors.validator.dynamic.error}
            </div>
          )}
          <div className="form__actions">
            <Reset />
            <Submit />
            <Submit data-testid="rsf-submit-disabled" disableOnError />
          </div>
        </form>
      </formContext.Provider>
    </>
  );
}
