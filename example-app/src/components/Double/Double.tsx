import { useId } from 'react';
import { IValidatorMultiple, useMultipleInput } from 'react-form-validation';

interface IDoubleProps {
  validator?: IValidatorMultiple;
}

function Double(props: IDoubleProps) {
  const { validator } = props;
  const id1 = useId();
  const id2 = useId();
  const { errors, refs } = useMultipleInput({ names: [id1, id2], validator });

  return (
    <div>
      <input name={id1} ref={refs.current?.[id1]} required type="number" />
      <input name={id2} ref={refs.current?.[id2]} required type="number" />
      {errors.main && <div style={{ color: 'red' }}>{errors.main}</div>}
    </div>
  );
}

export default Double;
