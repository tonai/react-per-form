import { DatePicker } from '@mui/x-date-pickers';
import type { Dayjs } from 'dayjs';
import { type FormEvent, useState } from 'react';
import type { IProps } from '../types';
import { type IFormValues, useForm } from '@per-form/react';

export default function Demo(props: IProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  function handleReset() {
    setValue(null);
  }

  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  const { errors, formProps, onChange } = useForm({
    ...props,
    onReset: handleReset,
    onSubmit: handleSubmit,
  });

  return (
    <form {...formProps}>
      <DatePicker
        name="mui"
        onChange={onChange(setValue, { name: 'mui' })}
        slotProps={{ textField: { required: true } }}
        value={value}
      />
      {errors.all.mui && <div className="error">{errors.all.mui}</div>}
      <div className="actions">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  );
}
