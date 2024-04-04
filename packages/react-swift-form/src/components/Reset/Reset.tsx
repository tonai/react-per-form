import type { ReactElement } from 'react';

type IElementProps = JSX.IntrinsicElements['input'];

export type IResetProps = IElementProps;

export function Reset(props: IResetProps): ReactElement {
  const { ...inputProps } = props;
  return <input data-testid="rsf-reset" type="reset" {...inputProps} />;
}
