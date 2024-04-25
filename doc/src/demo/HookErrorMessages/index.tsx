import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { type Dayjs } from 'dayjs';
import { type FormEvent, useState } from 'react';
import type { IProps } from '../types';
import { type IFormValues, useForm } from 'react-per-form';

const defaultValues = { mui: null };
const validators = {
  mui: (values: IFormValues) => {
    const date = values.mui as Dayjs;
    return date?.date() > 15 ? '' : 'dateUnderflow';
  },
};

const messages = {
  dateUnderflow: 'Choose a date after the 15th.',
  minDate: 'The date must be greater than or equal to today.',
  valueMissing: 'Did you miss something ?',
};

export default function Demo(props: IProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  function handleReset() {
    setValue(null);
  }

  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  const { errors, formProps, onChange, onError } = useForm({
    ...props,
    defaultValues,
    messages,
    onChangeOptOut: 'mui',
    onReset: handleReset,
    onSubmit: handleSubmit,
    validators,
  });

  return (
    <form {...formProps}>
      <DatePicker
        minDate={dayjs()}
        name="mui"
        onChange={onChange(setValue, { name: 'mui' })}
        onError={onError('mui')}
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
