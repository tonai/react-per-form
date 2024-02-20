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
      <Form {...hookProps} className="form" messages={messages}>
        <Dynamic />
        <div className="form__actions">
          <Reset />
          <Submit />
          <Submit disableOnError />
        </div>
      </Form>
    </>
  );
}
