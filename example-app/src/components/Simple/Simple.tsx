'use client';

import type { ReactElement } from 'react';

import { useInput } from '@per-form/react';
import { useId } from 'react';

import { fooValidator } from '../../helpers/validators';

function Simple(props: JSX.IntrinsicElements['input']): ReactElement {
  const { name } = props;
  const id = useId();
  const { error } = useInput({
    name: name ?? id,
    validator: fooValidator,
  });

  return (
    <div className="field">
      <label htmlFor="file">simple</label>
      <div className="input">
        <input autoComplete="off" data-testid="simple" name={id} {...props} />
        {Boolean(error) && (
          <div className="error" data-testid="simple-error">
            {error?.error}
          </div>
        )}
      </div>
    </div>
  );
}

export default Simple;
