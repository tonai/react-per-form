'use client';

import type { ReactElement } from 'react';

import { useInputs } from '@per-form/react';
import { useMemo, useRef, useState } from 'react';

import { dynamicValidator } from '../../helpers/validators';

function Dynamic(): ReactElement {
  const ref = useRef(0);
  const [ids, setIds] = useState<number[]>([]);
  const names = useMemo(() => ids.map((id) => `dynamic-${id}`), [ids]);
  const { errors } = useInputs({
    id: 'dynamic',
    names,
    validators: dynamicValidator,
  });

  function handleAdd(): void {
    setIds(ids.concat(ref.current));
    ref.current++;
  }

  function handleRemove(id: number): void {
    setIds(ids.filter((i) => i !== id));
  }

  return (
    <>
      <button data-testid="dynamic-add" onClick={handleAdd} type="button">
        Add
      </button>
      {ids.map((id) => (
        <div key={id} className="field">
          <label htmlFor="file">simple</label>
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
            {Boolean(errors.all[`dynamic-${id}`]) && (
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
    </>
  );
}

export default Dynamic;
