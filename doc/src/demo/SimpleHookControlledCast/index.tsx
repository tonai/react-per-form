import { type FormEvent, useState } from 'react';
import type { IProps } from '../types';
import { type IFormValues, useForm } from 'react-swift-form';

const defaultValues = { count: 0 };

export default function Demo(props: IProps) {
  const [value, setValue] = useState(0);

  function handleReset() {
    setValue(0);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  const { errors, formProps, onChange } = useForm({
    ...props,
    defaultValues,
    onReset: handleReset,
    onSubmit: handleSubmit,
  });

  return (
    <form {...formProps}>
      <input
        name="count"
        onChange={onChange({ callback: setValue, transformer: Number })}
        required
        type="number"
        value={value}
      />
      {errors.all.count && <div className="error">{errors.all.count}</div>}
      <div className="actions">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
      <div>
        value = {value} ({typeof value})
      </div>
    </form>
  );
}
