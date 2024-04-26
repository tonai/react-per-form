import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { type FormEvent } from 'react';
import type { IProps } from '../types';
import { Form, type IFormValues } from '@per-form/react';

const today = dayjs();
const transformers = { mui: (date: unknown) => dayjs(String(date)) };

export default function Demo(props: IProps) {
  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  return (
    <Form {...props} onSubmit={handleSubmit} transformers={transformers}>
      {({ errors }) => (
        <>
          <DatePicker
            defaultValue={today}
            name="mui"
            slotProps={{
              field: { clearable: true },
              textField: { required: true },
            }}
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
