import type { ReactElement } from 'react';

import { useFormValid } from '../../hooks';

type IElementProps = JSX.IntrinsicElements['input'];

export interface ISubmitProps extends IElementProps {
  disableOnError?: boolean;
}

export function Submit(props: ISubmitProps): ReactElement {
  const { disableOnError, ...inputProps } = props;
  const isValid = useFormValid();

  return (
    <input
      data-testid="rfv-submit"
      disabled={disableOnError ? !isValid : false}
      type="submit"
      {...inputProps}
    />
  );
}
