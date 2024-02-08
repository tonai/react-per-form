import {
  IFormProps,
  IFormValues,
  Form,
  Reset,
  Submit,
} from 'react-form-validation';
// import Double from './Double';
// import Dynamic from './Dynamic';
// import Input from './Input';

// function fooValidator(value: FormDataEntryValue | null) {
//   return String(value).includes('foo') ? '' : 'Value does not include "foo"';
// }

// function doubleValidator(values: IFormValues, names: string[]) {
//   if (values[names[0]] === '' || values[names[1]] === '') {
//     return '';
//   }
//   return Number(values[names[0]]) < Number(values[names[1]])
//     ? ''
//     : 'Second value must be greater than first value';
// }

// function dynamicValidator(values: IFormValues) {
//   return Object.values(values).reduce((a, b) => Number(a) + Number(b), 0) === 12
//     ? ''
//     : 'The sum must be equal to 12';
// }

// function globalValidator(values: IFormValues) {
//   return String(values.foo).includes('foo')
//     ? ''
//     : 'Value does not include "foo"';
// }

function globalValidatorMultiple(values: IFormValues, names: string[]) {
  return names.reduce((acc, name) => acc + Number(values[name]), 0) === 12
    ? ''
    : 'The sum must be equal to 12';
}

const messages = {
  valueMissing: "T'as pas oublié qqch ?",
};

export default function ExampleForm(props: Omit<IFormProps, 'children'>) {
  return (
    <Form
      {...props}
      messages={messages}
      validators={{
        sum12: { validator: globalValidatorMultiple, names: ['foo', 'bar'] },
      }}
    >
      <div>
        <input name="foo" required type="number" />
        <div></div>
      </div>
      <div>
        <input name="bar" required type="number" />
      </div>
      {/* <Input required validator={fooValidator} /> */}
      {/* <Double validator={doubleValidator} /> */}
      {/* <Dynamic validator={dynamicValidator} /> */}
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
