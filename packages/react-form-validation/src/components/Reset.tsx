type InputProps = JSX.IntrinsicElements['input'];

export interface IResetProps extends InputProps {}

export function Reset(props: IResetProps) {
  const { ...inputProps } = props;

  return <input {...inputProps} type="reset" />;
}
