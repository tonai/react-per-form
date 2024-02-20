import { Form, Reset, Submit } from 'react-form-validation';
import Double from '../../components/Double/Double';
import Filters from '../../components/Filters/Filters';
import { useFilters } from '../../hooks/useFilters';

const messages = {
  valueMissing: 'Did you miss something ?',
};

export default function ComponentDoubleForm() {
  const { filtersProps, hookProps } = useFilters();

  return (
    <>
      <Filters {...filtersProps} />
      <Form {...hookProps} className="form" messages={messages}>
        <Double />
        <div className="form__actions">
          <Reset />
          <Submit />
          <Submit disableOnError />
        </div>
      </Form>
    </>
  );
}
