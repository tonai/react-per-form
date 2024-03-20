import { Error, Form, Reset, Submit } from 'react-form-validation';
import Fields from '../../components/Fields/Fields';
import Filters from '../../components/Filters/Filters';
import { useFilters } from '../../hooks/useFilters';
import { handleSubmit } from '../../helpers/form';

const messages = {
  valueMissing: 'Did you miss something ?',
};

export default function ComponentFieldsForm() {
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
      >
        <Fields />
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
