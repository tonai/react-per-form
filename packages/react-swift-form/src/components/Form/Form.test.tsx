import { fireEvent, render, screen } from '@testing-library/react';

import { Form } from './Form';

describe('Form component', () => {
  it('should render the children', () => {
    render(
      <Form>
        <input data-testid="rfv-input" name="foo" />
      </Form>,
    );
    expect(screen.getByTestId('rfv-form')).toBeVisible();
    expect(screen.getByTestId('rfv-input')).toBeVisible();
  });

  it('should call the onSubmit function (form valid)', () => {
    const onSubmit = jest.fn();
    render(
      <Form onSubmit={onSubmit}>
        <input name="foo" />
      </Form>,
    );
    fireEvent.submit(screen.getByTestId('rfv-form'));
    expect(onSubmit).toHaveBeenCalled();
    expect((onSubmit.mock.calls[0] as unknown[])[1]).toEqual({ foo: '' });
  });

  it('should get the form values in the onSubmit function', () => {
    const onSubmit = jest.fn();
    render(
      <Form onSubmit={onSubmit}>
        <input data-testid="foo" name="foo" />
      </Form>,
    );
    fireEvent.change(screen.getByTestId('foo'), { target: { value: 'bar' } });
    fireEvent.submit(screen.getByTestId('rfv-form'));
    expect(onSubmit).toHaveBeenCalled();
    expect((onSubmit.mock.calls[0] as unknown[])[1]).toEqual({ foo: 'bar' });
  });

  it('should not call the onSubmit function (form invalid)', () => {
    const onSubmit = jest.fn();
    render(
      <Form onSubmit={onSubmit}>
        <input name="foo" required />
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
