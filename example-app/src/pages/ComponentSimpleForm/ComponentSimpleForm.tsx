import { Error, Form, Reset, Submit } from 'react-form-validation';
import Simple from '../../components/Simple/Simple';
import Filters from '../../components/Filters/Filters';
import { globalFooValidator } from '../../helpers/validators';
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
        data-testid="form"
        messages={messages}
        validators={{
          foobar: { validator: globalFooValidator, names: ['foo'] },
        }}
      >
        <Simple name="foo" required />
        <Error className="error" global />
        <div className="form__actions">
          <Reset />
          <Submit />
          <Submit data-testid="rfv-submit-disabled" disableOnError />
        </div>
      </Form>
    </>
  );
}
