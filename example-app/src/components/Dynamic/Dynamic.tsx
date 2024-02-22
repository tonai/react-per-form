import { useMemo, useRef, useState } from 'react';
import { useInputs } from 'react-form-validation';
import { dynamicValidator } from '../../helpers/validators';

function Dynamic() {
  const ref = useRef(0);
  const [ids, setIds] = useState<number[]>([]);
  const names = useMemo(() => ids.map((id) => `$dynamic-${id}`), [ids]);
  const { errors } = useInputs({
    id: 'dynamic',
    names,
    validator: dynamicValidator,
  });

  function handleAdd() {
    setIds(ids.concat(ref.current));
    ref.current++;
  }

  function handleRemove(id: number) {
    setIds(ids.filter((i) => i !== id));
  }

  return (
    <div>
      <button data-testid="dynamic-add" onClick={handleAdd} type="button">
        Add
      </button>
      {ids.map((id) => (
        <div key={id}>
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
          {errors.all?.[`dynamic-${id}`] && (
            <div className="error" data-testid={`dynamic-${id}-error`}>
              {errors.native?.[`dynamic-${id}`]}
            </div>
          )}
        </div>
      ))}
      {errors.validator?.dynamic && (
        <div className="error" data-testid="dynamic-validator-error">
          {errors.validator.dynamic.error}
        </div>
      )}
    </div>
  );
}

export default Dynamic;
