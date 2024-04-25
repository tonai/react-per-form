import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Form } from './Form';

describe('Form component', () => {
  it('should render the children', async () => {
    // Init
    render(
      <Form>
        <input data-testid="rpf-input" name="foo" />
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    expect(screen.getByTestId('rpf-form')).toBeVisible();
    expect(screen.getByTestId('rpf-input')).toBeVisible();
  });

  it('should render the children using render props', async () => {
    // Init
    render(<Form>{() => <input data-testid="rpf-input" name="foo" />}</Form>);
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    expect(screen.getByTestId('rpf-form')).toBeVisible();
    expect(screen.getByTestId('rpf-input')).toBeVisible();
  });

  it('should be able to get the context using render props', async () => {
    // Init
    render(
      <Form mode="blur">
        {({ mode }) => <div data-testid="mode">{mode}</div>}
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    expect(screen.getByTestId('mode')).toHaveTextContent('blur');
  });

  it('should call the onSubmit function (form valid)', async () => {
    const onSubmit = jest.fn();
    // Init
    render(
      <Form onSubmit={onSubmit}>
        <input name="foo" />
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rpf-form'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      { foo: '' },
      expect.any(Function),
    );
  });

  it('should get the form values in the onSubmit function', async () => {
    const onSubmit = jest.fn();
    // Init
    render(
      <Form onSubmit={onSubmit}>
        <input data-testid="foo" name="foo" />
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    // Change
    fireEvent.change(screen.getByTestId('foo'), { target: { value: 'bar' } });
    // Submit
    fireEvent.submit(screen.getByTestId('rpf-form'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      { foo: 'bar' },
      expect.any(Function),
    );
  });

  it('should call the onSubmitError function (form invalid)', async () => {
    const onSubmit = jest.fn();
    const onSubmitError = jest.fn();
    // Init
    render(
      <Form onSubmit={onSubmit} onSubmitError={onSubmitError}>
        <input name="foo" required />
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rpf-form'));
    await waitFor(() => expect(onSubmitError).toHaveBeenCalled());
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should the onSubmitError function (form invalid with custom validator)', async () => {
    const onSubmit = jest.fn();
    const onSubmitError = jest.fn();
    // Init
    render(
      <Form
        onSubmit={onSubmit}
        onSubmitError={onSubmitError}
        validators={{ foo: () => 'Validator error' }}
      >
        <input name="foo" required />
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rpf-form'));
    await waitFor(() => expect(onSubmitError).toHaveBeenCalled());
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should initialize the default value when using the onChange handler', async () => {
    const onSubmit = jest.fn();
    const onChangeSpy = jest.fn();
    // Init
    render(
      <Form defaultValues={{ foo: 42 }} onSubmit={onSubmit}>
        {({ onChange }) => (
          <input name="foo" onChange={onChange(onChangeSpy, { name: 'foo' })} />
        )}
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rpf-form'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      { foo: 42 },
      expect.any(Function),
    );
  });
});
