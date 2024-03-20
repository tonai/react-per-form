import { Form, Reset, Submit } from 'react-form-validation';
import Double from '../../components/Double/Double';
import Filters from '../../components/Filters/Filters';
import { useFilters } from '../../hooks/useFilters';
import { handleSubmit } from '../../helpers/form';

const messages = {
  valueMissing: 'Did you miss something ?',
};

export default function ComponentDoubleForm() {
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
        <Double />
        <div className="form__actions">
          <Reset />
          <Submit />
          <Submit data-testid="rfv-submit-disabled" disableOnError />
        </div>
      </Form>
    </>
  );
}
