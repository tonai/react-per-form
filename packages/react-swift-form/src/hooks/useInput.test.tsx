import { fireEvent, renderHook, screen, waitFor } from '@testing-library/react';

import { Form } from '../components/Form/Form';

import { useInput } from './useInput';

describe('useInputs hook', () => {
  it('should return no errors', async () => {
    // Init
    const { result } = renderHook(() => useInput({ name: 'foo' }), {
      wrapper: ({ children }) => (
        <Form useNativeValidation={false}>
          <input name="foo" />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(result.current.error).toEqual(undefined);
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
  });

  it('should return native errors when submitting the form', async () => {
    // Init
    const { result } = renderHook(() => useInput({ name: 'foo' }), {
      wrapper: ({ children }) => (
        <Form useNativeValidation={false}>
          <input name="foo" required />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(result.current.error).toEqual(undefined);
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() =>
      expect(result.current.error).toEqual({
        error: 'Constraints not satisfied',
        global: false,
        id: 'foo',
        names: ['foo'],
      }),
    );
    expect(result.current.errors).toEqual({
      all: {
        foo: 'Constraints not satisfied',
      },
      global: {},
      main: {
        error: 'Constraints not satisfied',
        global: false,
        id: 'foo',
        names: ['foo'],
      },
      manual: {},
      native: {
        foo: 'Constraints not satisfied',
      },
      validator: {},
    });
  });

  it('should return validator errors when submitting the form', async () => {
    // Init
    const { result } = renderHook(
      () =>
        useInput({
          name: 'foo',
          validator: () => 'Validator error',
        }),
      {
        wrapper: ({ children }) => (
          <Form useNativeValidation={false}>
            <input name="foo" />
            {children}
          </Form>
        ),
      },
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(result.current.error).toEqual(undefined);
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() =>
      expect(result.current.error).toEqual({
        error: 'Validator error',
        global: false,
        id: 'foo',
        names: ['foo'],
      }),
    );
    expect(result.current.errors).toEqual({
      all: {
        foo: 'Validator error',
      },
      global: {},
      main: {
        error: 'Validator error',
        global: false,
        id: 'foo',
        names: ['foo'],
      },
      manual: {},
      native: {
        foo: '',
      },
      validator: {
        foo: {
          error: 'Validator error',
          global: false,
          names: ['foo'],
        },
      },
    });
  });

  it('should return custom errors when submitting the form', async () => {
    // Init
    const { result } = renderHook(
      () =>
        useInput({
          messages: { valueMissing: 'Custom error' },
          name: 'foo',
        }),
      {
        wrapper: ({ children }) => (
          <Form useNativeValidation={false}>
            <input name="foo" required />
            {children}
          </Form>
        ),
      },
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(result.current.error).toEqual(undefined);
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() =>
      expect(result.current.error).toEqual({
        error: 'Custom error',
        global: false,
        id: 'foo',
        names: ['foo'],
      }),
    );
    expect(result.current.errors).toEqual({
      all: {
        foo: 'Custom error',
      },
      global: {},
      main: {
        error: 'Custom error',
        global: false,
        id: 'foo',
        names: ['foo'],
      },
      manual: {},
      native: {
        foo: 'Custom error',
      },
      validator: {},
    });
  });

  it('should initialize default values', async () => {
    // Init
    renderHook(
      () =>
        useInput({
          defaultValue: 42,
          name: 'foo',
        }),
      {
        wrapper: ({ children }) => (
          <Form useNativeValidation={false}>
            <input data-testid="foo" name="foo" required />
            {children}
          </Form>
        ),
      },
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(screen.getByTestId('foo')).toHaveValue('42');
  });

  it('should transform the value', async () => {
    const onSubmit = jest.fn();
    // Init
    renderHook(
      () =>
        useInput({
          name: 'foo',
          transformer: Number,
        }),
      {
        wrapper: ({ children }) => (
          <Form onSubmit={onSubmit} useNativeValidation={false}>
            <input data-testid="foo" name="foo" />
            {children}
          </Form>
        ),
      },
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.any(Object),
        { foo: 0 },
        expect.any(Function),
      ),
    );
    onSubmit.mockClear();
    // Change
    fireEvent.change(screen.getByTestId('foo'), { target: { value: '42' } });
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.any(Object),
        { foo: 42 },
        expect.any(Function),
      ),
    );
  });

  it('should trigger the validator when the value change', async () => {
    const validator = jest.fn();
    // Init
    renderHook(
      () =>
        useInput({
          name: 'foo',
          validator,
        }),
      {
        wrapper: ({ children }) => (
          <Form useNativeValidation={false}>
            <input data-testid="foo" name="foo" />
            {children}
          </Form>
        ),
      },
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(validator).toHaveBeenCalled();
    validator.mockClear();
    // Change
    fireEvent.change(screen.getByTestId('foo'), { target: { value: '42' } });
    await waitFor(() => expect(validator).toHaveBeenCalled());
  });

  it('should not trigger the validator when using onChangeOptOut', async () => {
    const onSubmit = jest.fn();
    const validator = jest.fn();
    // Init
    renderHook(
      () =>
        useInput({
          name: 'foo',
          onChangeOptOut: true,
          validator,
        }),
      {
        wrapper: ({ children }) => (
          <Form onSubmit={onSubmit} useNativeValidation={false}>
            <input data-testid="foo" name="foo" />
            <input name="bar" />
            {children}
          </Form>
        ),
      },
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(validator).toHaveBeenCalled();
    validator.mockClear();
    // Change
    fireEvent.change(screen.getByTestId('foo'), { target: { value: '42' } });
    expect(validator).not.toHaveBeenCalled();
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(validator).toHaveBeenCalledTimes(1);
  });

  it('should trigger the validator when the field focus out', async () => {
    // Init
    const validator = jest.fn();
    const { result } = renderHook(
      () =>
        useInput({
          name: 'foo',
          validator,
        }),
      {
        wrapper: ({ children }) => (
          <Form mode="blur" useNativeValidation={false}>
            <input data-testid="foo" name="foo" required />
            {children}
          </Form>
        ),
      },
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(validator).toHaveBeenCalled();
    validator.mockClear();
    // Blur
    fireEvent.blur(screen.getByTestId('foo'));
    await waitFor(() => {
      expect(result.current.error).toEqual({
        error: 'Constraints not satisfied',
        global: false,
        id: 'foo',
        names: ['foo'],
      });
    });
    expect(validator).toHaveBeenCalled();
  });

  it('should not trigger the change when using onBlurOptOut', async () => {
    const onSubmit = jest.fn();
    const validator = jest.fn();
    // Init
    renderHook(
      () =>
        useInput({
          name: 'foo',
          onBlurOptOut: true,
          validator,
        }),
      {
        wrapper: ({ children }) => (
          <Form mode="blur" onSubmit={onSubmit} useNativeValidation={false}>
            <input data-testid="foo" name="foo" />
            <input name="bar" />
            {children}
          </Form>
        ),
      },
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(validator).toHaveBeenCalled();
    validator.mockClear();
    // Blur
    fireEvent.blur(screen.getByTestId('foo'));
    expect(validator).not.toHaveBeenCalled();
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(validator).toHaveBeenCalledTimes(1);
  });
});
