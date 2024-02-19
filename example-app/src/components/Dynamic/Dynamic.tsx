import { useId, useMemo, useRef, useState } from 'react';
import { IFormValues, useMultipleInput } from 'react-form-validation';

function dynamicValidator(values: IFormValues) {
  return Object.values(values).reduce((a, b) => Number(a) + Number(b), 0) === 12
    ? ''
    : 'The sum must be equal to 12';
}

function Dynamic() {
  const name = useId();
  const ref = useRef(0);
  const [ids, setIds] = useState<number[]>([]);
  const names = useMemo(() => ids.map((id) => `${name}-${id}`), [ids, name]);
  const { errors } = useMultipleInput({
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
      <button onClick={handleAdd} type="button">
        Add
      </button>
      {ids.map((id) => (
        <div key={id}>
          <input
            autoComplete="off"
            name={`${name}-${id}`}
            required
            type="number"
          />
          <button
            className="inline"
            onClick={() => handleRemove(id)}
            type="button"
          >
            Remove
          </button>
          {errors.all?.[`${name}-${id}`] && (
            <div style={{ color: 'red' }}>
              {errors.native?.[`${name}-${id}`]}
            </div>
          )}
        </div>
      ))}
      {errors.validator?.dynamic && (
        <div style={{ color: 'red' }}>{errors.validator.dynamic.error}</div>
      )}
    </div>
  );
}

export default Dynamic;
