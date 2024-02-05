import { useContext } from 'react';
import { formContext } from '../contexts';

type InputProps = JSX.IntrinsicElements['input'];

export interface ISubmitProps extends InputProps {
  disableOnError?: boolean;
}

export function Submit(props: ISubmitProps) {
  const { disableOnError, ...inputProps } = props;
  const { isValid } = useContext(formContext);

  return (
    <input
      {...inputProps}
      disabled={disableOnError && !isValid}
      type="submit"
    />
  );
}
