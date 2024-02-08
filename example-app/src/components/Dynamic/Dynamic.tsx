import { useId, useRef, useState } from 'react';
import { IValidatorMultiple, useMultipleInput } from 'react-form-validation';

interface IDynamicProps {
  validator?: IValidatorMultiple;
}

function Dynamic(props: IDynamicProps) {
  const { validator } = props;
  const name = useId();
  const ref = useRef(0);
  const [ids, setIds] = useState<number[]>([]);
  const { errors, refs } = useMultipleInput({
    names: ids.map((id) => `${name}-${id}`),
    validator,
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
            name={`${name}-${id}`}
            ref={refs.current?.[`${name}-${id}`]}
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
            <div style={{ color: 'red' }}>{errors.all?.[`${name}-${id}`]}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Dynamic;
