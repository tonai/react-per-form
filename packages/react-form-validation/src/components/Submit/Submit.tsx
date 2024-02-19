import type { ReactElement } from 'react';

import { useFormValid } from '../../hooks/useFormValid';

type IElementProps = JSX.IntrinsicElements['input'];

export interface ISubmitProps extends IElementProps {
  disableOnError?: boolean;
}

export function Submit(props: ISubmitProps): ReactElement {
  const { disableOnError, ...inputProps } = props;
  const isValid = useFormValid();

  return (
    <input
      {...inputProps}
      disabled={disableOnError ? !isValid : false}
      type="submit"
    />
  );
}
