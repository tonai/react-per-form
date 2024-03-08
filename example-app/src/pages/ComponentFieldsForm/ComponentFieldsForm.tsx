import { Error, Form, Reset, Submit } from 'react-form-validation';
import Fields from '../../components/Fields/Fields';
import Filters from '../../components/Filters/Filters';
import { useFilters } from '../../hooks/useFilters';

const messages = {
  valueMissing: 'Did you miss something ?',
};

export default function ComponentFieldsForm() {
  const { filtersProps, hookProps } = useFilters();

  return (
    <>
      <Filters {...filtersProps} />
      <Form
        {...hookProps}
        className="form"
        data-testid="form"
        messages={messages}
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
