import { Form, Reset, Submit } from 'react-swift-form';
import Dynamic from '../../components/Dynamic/Dynamic';
import Filters from '../../components/Filters/Filters';
import { useFilters } from '../../hooks/useFilters';
import { handleSubmit } from '../../helpers/form';

const messages = {
  valueMissing: 'Did you miss something ?',
};

export default function ComponentDynamicForm() {
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
        <Dynamic />
        <div className="form__actions">
          <Reset />
          <Submit />
          <Submit data-testid="rfv-submit-disabled" disableOnError />
        </div>
      </Form>
    </>
  );
}
