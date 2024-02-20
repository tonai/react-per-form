import { Form, Reset, Submit } from 'react-form-validation';
import Input from '../../components/Input/Input';
import Filters from '../../components/Filters/Filters';
import { globalValidatorMultiple } from '../../helpers/validators';
import { useFilters } from '../../hooks/useFilters';

const messages = {
  valueMissing: 'Did you miss something ?',
};

export default function ComponentSimpleForm() {
  const { filtersProps, hookProps } = useFilters();

  return (
    <>
      <Filters {...filtersProps} />
      <Form
        {...hookProps}
        className="form"
        messages={messages}
        validators={{
          foobar: { validator: globalValidatorMultiple, names: ['foo'] },
        }}
      >
        <Input name="foo" required />
        <div className="form__actions">
          <Reset />
          <Submit />
          <Submit disableOnError />
        </div>
      </Form>
    </>
  );
}
