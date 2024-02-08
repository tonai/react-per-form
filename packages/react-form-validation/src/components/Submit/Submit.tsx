import type { ReactElement } from 'react';

import { useContext } from 'react';

import { formContext } from '../../contexts';

type IElementProps = JSX.IntrinsicElements['input'];

export interface ISubmitProps extends IElementProps {
  disableOnError?: boolean;
}

export function Submit(props: ISubmitProps): ReactElement {
  const { disableOnError, ...inputProps } = props;
  const { isValid } = useContext(formContext);

  return (
    <input
      {...inputProps}
      disabled={disableOnError ? !isValid : false}
      type="submit"
    />
  );
}
