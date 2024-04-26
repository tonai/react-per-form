import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { type Dayjs } from 'dayjs';
import { type FormEvent, useState } from 'react';
import type { IProps } from '../types';
import { type IFormValues, useForm } from '@per-form/react';

const defaultValues = { mui: dayjs() };

export default function Demo(props: IProps) {
  const [value, setValue] = useState<Dayjs>(defaultValues.mui);

  function handleReset() {
    setValue(defaultValues.mui);
  }

  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
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
