import { act, fireEvent, renderHook, screen } from '@testing-library/react';

import { Form } from '../components/Form/Form';

import { useInput } from './useInput';

jest.useFakeTimers();

describe('useInputs hook', () => {
  it('should return no errors', () => {
    const { result } = renderHook(() => useInput({ name: 'foo' }), {
      wrapper: ({ children }) => (
        <Form useNativeValidation={false}>
          <input name="foo" />
          {children}
        </Form>
      ),
    });
    expect(result.current.error).toEqual(undefined);
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
  });

  it('should return native errors when submitting the form', () => {
    const { result } = renderHook(() => useInput({ name: 'foo' }), {
      wrapper: ({ children }) => (
        <Form useNativeValidation={false}>
          <input name="foo" required />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
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
    expect(result.current.error).toEqual({
      error: 'Constraints not satisfied',
      global: false,
      id: 'foo',
      names: ['foo'],
    });
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

  it('should return validator errors when submitting the form', () => {
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
    act(() => jest.runAllTimers());
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
    expect(result.current.error).toEqual({
      error: 'Validator error',
      global: false,
      id: 'foo',
      names: ['foo'],
    });
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

  it('should return custom errors when submitting the form', () => {
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
    act(() => jest.runAllTimers());
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
    expect(result.current.error).toEqual({
      error: 'Custom error',
      global: false,
      id: 'foo',
      names: ['foo'],
    });
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

  it('should initialize default values', () => {
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
    act(() => jest.runAllTimers());
    expect(screen.getByTestId('foo')).toHaveValue('42');
  });

  it('should transform the value', () => {
    const onSubmit = jest.fn();
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
    act(() => jest.runAllTimers());
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      { foo: 0 },
      expect.any(Function),
    );
    // Change
    fireEvent.change(screen.getByTestId('foo'), { target: { value: '42' } });
    act(() => jest.runAllTimers());
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      { foo: 42 },
      expect.any(Function),
    );
  });

  it('should trigger the validator when the value change', () => {
    const validator = jest.fn();
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
    act(() => jest.runAllTimers());
    expect(validator).toHaveBeenCalled();
    validator.mockClear();
    // Change
    fireEvent.change(screen.getByTestId('foo'), { target: { value: '42' } });
    act(() => jest.runAllTimers());
    expect(validator).toHaveBeenCalled();
  });

  it('should not trigger the validator when using onChangeOptOut', () => {
    const validator = jest.fn();
    renderHook(
      () =>
        useInput({
          name: 'foo',
          onChangeOptOut: true,
          validator,
        }),
      {
        wrapper: ({ children }) => (
          <Form useNativeValidation={false}>
            <input data-testid="foo" name="foo" />
            <input name="bar" />
            {children}
          </Form>
        ),
      },
    );
    act(() => jest.runAllTimers());
    expect(validator).toHaveBeenCalled();
    validator.mockClear();
    // Change
    fireEvent.change(screen.getByTestId('foo'), { target: { value: '42' } });
    act(() => jest.runAllTimers());
    expect(validator).not.toHaveBeenCalled();
  });

  it('should trigger the validator when the field focus out', () => {
    const validator = jest.fn();
    renderHook(
      () =>
        useInput({
          name: 'foo',
          validator,
        }),
      {
        wrapper: ({ children }) => (
          <Form mode="blur" useNativeValidation={false}>
            <input data-testid="foo" name="foo" />
            {children}
          </Form>
        ),
      },
    );
    act(() => jest.runAllTimers());
    expect(validator).toHaveBeenCalled();
    validator.mockClear();
    // Blur
    fireEvent.blur(screen.getByTestId('foo'));
    act(() => jest.runAllTimers());
    expect(validator).toHaveBeenCalled();
  });

  it('should not trigger the change when using onBlurOptOut', () => {
    const validator = jest.fn();
    renderHook(
      () =>
        useInput({
          name: 'foo',
          onBlurOptOut: true,
          validator,
        }),
      {
        wrapper: ({ children }) => (
          <Form mode="blur" useNativeValidation={false}>
            <input data-testid="foo" name="foo" />
            <input name="bar" />
            {children}
          </Form>
        ),
      },
    );
    act(() => jest.runAllTimers());
    expect(validator).toHaveBeenCalled();
    validator.mockClear();
    // Blur
    fireEvent.blur(screen.getByTestId('foo'));
    act(() => jest.runAllTimers());
    expect(validator).not.toHaveBeenCalled();
  });
});
