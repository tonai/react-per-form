import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { type Dayjs } from 'dayjs';
import { type FormEvent, useState } from 'react';
import type { IProps } from '../types';
import { Form, type IFormValues } from 'react-swift-form';

export default function Demo(props: IProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  function handleReset() {
    setValue(null);
  }

  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  return (
    <Form {...props} onReset={handleReset} onSubmit={handleSubmit}>
      {({ errors, onChange, onError }) => (
        <>
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
        </>
      )}
    </Form>
  );
}
