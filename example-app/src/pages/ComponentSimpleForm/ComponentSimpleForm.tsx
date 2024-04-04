import { Error, Form, Reset, Submit } from 'react-swift-form';
import Simple from '../../components/Simple/Simple';
import Filters from '../../components/Filters/Filters';
import { globalFooValidator } from '../../helpers/validators';
import { useFilters } from '../../hooks/useFilters';
import { handleSubmit } from '../../helpers/form';

const messages = {
  valueMissing: 'Did you miss something ?',
};

export default function ComponentSimpleForm() {
  const { filtersProps, formData } = useFilters();

  return (
    <>
      <Filters {...filtersProps} />
      <Form
        {...formData}
        className="form"
        data-testid="form"
        messages={messages}
        onSubmit={handleSubmit}
        validators={{
          foobar: { validator: globalFooValidator, names: ['foo'] },
        }}
      >
        <Simple name="foo" required />
        <Error className="error" global />
        <div className="form__actions">
          <Reset />
          <Submit />
          <Submit data-testid="rsf-submit-disabled" disableOnError />
        </div>
      </Form>
    </>
  );
}
