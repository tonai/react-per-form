import { type ChangeEvent, type FormEvent, useState } from 'react';
import type { IProps } from '../types';
import { type IFormValues, useForm } from 'react-swift-form';

export default function Demo(props: IProps) {
  const [value, setValue] = useState('');

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  function handleReset() {
    setValue('');
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  const { errors, formProps } = useForm({
    ...props,
    onReset: handleReset,
    onSubmit: handleSubmit,
  });

  return (
    <form {...formProps}>
      <input name="text" onChange={handleChange} required value={value} />
      {errors.all.text && <div className="error">{errors.all.text}</div>}
      <div className="actions">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
      <div>value = {value}</div>
    </form>
  );
}
