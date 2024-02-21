import { Form, Reset, Submit } from 'react-form-validation';
import Dynamic from '../../components/Dynamic/Dynamic';
import Filters from '../../components/Filters/Filters';
import { useFilters } from '../../hooks/useFilters';

const messages = {
  valueMissing: 'Did you miss something ?',
};

export default function ComponentDynamicForm() {
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
