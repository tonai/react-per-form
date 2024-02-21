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
      native: {},
      validator: {},
    });
    // Submit
    fireEvent.submit(screen.getByTestId('rfv-form'));
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
      native: {},
      validator: {},
    });
    // Submit
    fireEvent.submit(screen.getByTestId('rfv-form'));
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
      native: {},
      validator: {},
    });
    // Submit
    fireEvent.submit(screen.getByTestId('rfv-form'));
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
      native: {
        foo: 'Custom error',
      },
      validator: {},
    });
  });
});
