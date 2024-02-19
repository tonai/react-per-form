import { render, screen } from '@testing-library/react';

import { Form } from '../Form/Form';

import { Submit } from './Submit';

describe('Submit component', () => {
  it('should be enabled (disableOnError off)', () => {
    render(
      <Form>
        <Submit />
      </Form>,
    );
    expect(screen.getByTestId('rfv-submit')).not.toBeDisabled();
  });

  it('should be enabled (empty form)', () => {
    render(
      <Form>
        <Submit disableOnError />
      </Form>,
    );
    expect(screen.getByTestId('rfv-submit')).not.toBeDisabled();
  });

  it('should be enabled (valid form)', () => {
    render(
      <Form>
        <input />
        <Submit disableOnError />
      </Form>,
    );
    expect(screen.getByTestId('rfv-submit')).not.toBeDisabled();
  });

  it('should be disabled (invalid form)', () => {
    render(
      <Form>
        <input required />
        <Submit disableOnError />
      </Form>,
    );
    expect(screen.getByTestId('rfv-submit')).toBeDisabled();
  });
});
