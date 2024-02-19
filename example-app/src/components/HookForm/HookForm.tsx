import {
  IFormProps,
  IFormValues,
  Form,
  Reset,
  Submit,
} from 'react-form-validation';
import Double from '../Double/Double';
import Dynamic from '../Dynamic/Dynamic';
import Input from '../Input/Input';

function globalValidatorMultiple(values: IFormValues) {
  return String(values.foo).includes('bar')
    ? ''
    : 'Value should also contains "bar"';
}

const messages = {
  valueMissing: 'Did you miss something ?',
};

export default function HookForm(props: Omit<IFormProps, 'children'>) {
  return (
    <Form
      {...props}
      messages={messages}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      validators={{
        foobar: { validator: globalValidatorMultiple, names: ['foo'] },
      }}
    >
      <Input name="foo" required />
      <Double />
      <Dynamic />
      <div>
        <Reset />
      </div>
      <div>
        <Submit />
      </div>
      <div>
        <Submit disableOnError />
      </div>
    </Form>
  );
}
