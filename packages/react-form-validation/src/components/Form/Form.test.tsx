import { fireEvent, render, screen } from '@testing-library/react';

import { Form } from './Form';

describe('Form component', () => {
  it('should render the children', () => {
    render(
      <Form>
        <input data-testid="rfv-input" />
      </Form>,
    );
    expect(screen.getByTestId('rfv-form')).toBeVisible();
    expect(screen.getByTestId('rfv-input')).toBeVisible();
  });

  it('should call the onSubmit function (form valid)', () => {
    const onSubmit = jest.fn();
    render(
      <Form onSubmit={onSubmit}>
        <input />
      </Form>,
    );
    fireEvent.submit(screen.getByTestId('rfv-form'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should not call the onSubmit function (form invalid)', () => {
    const onSubmit = jest.fn();
    render(
      <Form onSubmit={onSubmit}>
        <input required />
      </Form>,
    );
    fireEvent.submit(screen.getByTestId('rfv-form'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should not call the onSubmit function (form invalid with custom validator)', () => {
    const onSubmit = jest.fn();
    render(
      <Form onSubmit={onSubmit} validators={{ foo: () => 'Validator error' }}>
        <input name="foo" required />
      </Form>,
    );
    fireEvent.submit(screen.getByTestId('rfv-form'));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
