import { act, fireEvent, renderHook, screen } from '@testing-library/react';

import { Form } from '../components/Form/Form';

import { useInputs } from './useInputs';

jest.useFakeTimers();

describe('useInputs hook', () => {
  it('should return no errors', () => {
    const { result } = renderHook(() => useInputs({ names: ['foo', 'bar'] }), {
      wrapper: ({ children }) => (
        <Form useNativeValidation={false}>
          <input name="foo" />
          <input name="bar" />
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
  });

  it('should return native errors (mode=submit)', () => {
    const { result } = renderHook(() => useInputs({ names: ['foo', 'bar'] }), {
      wrapper: ({ children }) => (
        <Form useNativeValidation={false}>
          <input name="foo" />
          <input name="bar" required />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    // Submit
    fireEvent.submit(screen.getByTestId('rfv-form'));
    expect(result.current.error).toEqual({
      error: 'Constraints not satisfied',
      global: false,
      id: 'bar',
      names: ['bar'],
    });
    expect(result.current.errors).toEqual({
      all: {
        bar: 'Constraints not satisfied',
        foo: '',
      },
      global: {},
      main: {
        error: 'Constraints not satisfied',
        global: false,
        id: 'bar',
        names: ['bar'],
      },
      native: {
        bar: 'Constraints not satisfied',
        foo: '',
      },
      validator: {},
    });
  });

  it('should return validator errors (mode=submit)', () => {
    const { result } = renderHook(
      () =>
        useInputs({
          names: ['foo', 'bar'],
          validator: () => 'Validator error',
        }),
      {
        wrapper: ({ children }) => (
          <Form useNativeValidation={false}>
            <input name="foo" />
            <input name="bar" />
            {children}
          </Form>
        ),
      },
    );
    act(() => jest.runAllTimers());
    // Submit
    fireEvent.submit(screen.getByTestId('rfv-form'));
    expect(result.current.error).toEqual({
      error: 'Validator error',
      global: false,
      id: 'foo,bar',
      names: ['foo', 'bar'],
    });
    expect(result.current.errors).toEqual({
      all: {
        bar: 'Validator error',
        foo: 'Validator error',
      },
      global: {},
      main: {
        error: 'Validator error',
        global: false,
        id: 'foo,bar',
        names: ['foo', 'bar'],
      },
      native: {
        bar: '',
        foo: '',
      },
      validator: {
        'foo,bar': {
          error: 'Validator error',
          global: false,
          names: ['foo', 'bar'],
        },
      },
    });
  });

  it('should return custom errors (mode=submit)', () => {
    const { result } = renderHook(
      () =>
        useInputs({
          messages: { valueMissing: 'Custom error' },
          names: ['foo', 'bar'],
        }),
      {
        wrapper: ({ children }) => (
          <Form useNativeValidation={false}>
            <input name="foo" />
            <input name="bar" required />
            {children}
          </Form>
        ),
      },
    );
    act(() => jest.runAllTimers());
    // Submit
    fireEvent.submit(screen.getByTestId('rfv-form'));
    expect(result.current.error).toEqual({
      error: 'Custom error',
      global: false,
      id: 'bar',
      names: ['bar'],
    });
    expect(result.current.errors).toEqual({
      all: {
        bar: 'Custom error',
        foo: '',
      },
      global: {},
      main: {
        error: 'Custom error',
        global: false,
        id: 'bar',
        names: ['bar'],
      },
      native: {
        bar: 'Custom error',
        foo: '',
      },
      validator: {},
    });
  });

  it('should validate the form (mode=blur)', () => {
    const { result } = renderHook(() => useInputs({ names: ['foo', 'bar'] }), {
      wrapper: ({ children }) => (
        <Form mode="blur" useNativeValidation={false}>
          <input name="foo" />
          <input data-testid="rfv-input" name="bar" required />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    // Blur
    fireEvent.blur(screen.getByTestId('rfv-input'));
    expect(result.current.error).toEqual({
      error: 'Constraints not satisfied',
      global: false,
      id: 'bar',
      names: ['bar'],
    });
    expect(result.current.errors).toEqual({
      all: {
        bar: 'Constraints not satisfied',
      },
      global: {},
      main: {
        error: 'Constraints not satisfied',
        global: false,
        id: 'bar',
        names: ['bar'],
      },
      native: {
        bar: 'Constraints not satisfied',
      },
      validator: {},
    });
  });

  it('should validate the form (mode=change)', () => {
    const { result } = renderHook(() => useInputs({ names: ['foo', 'bar'] }), {
      wrapper: ({ children }) => (
        <Form mode="change" useNativeValidation={false}>
          <input name="foo" />
          <input data-testid="rfv-input" name="bar" required />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    // Change
    fireEvent.change(screen.getByTestId('rfv-input'), {
      target: { value: 'foo' },
    });
    act(() => jest.runAllTimers());
    expect(result.current.error).toEqual(undefined);
    expect(result.current.errors).toEqual({
      all: { bar: '' },
      global: {},
      native: { bar: '' },
      validator: {},
    });
    // Change
    fireEvent.change(screen.getByTestId('rfv-input'), {
      target: { value: '' },
    });
    act(() => jest.runAllTimers());
    expect(result.current.error).toEqual({
      error: 'Constraints not satisfied',
      global: false,
      id: 'bar',
      names: ['bar'],
    });
    expect(result.current.errors).toEqual({
      all: {
        bar: 'Constraints not satisfied',
      },
      global: {},
      main: {
        error: 'Constraints not satisfied',
        global: false,
        id: 'bar',
        names: ['bar'],
      },
      native: {
        bar: 'Constraints not satisfied',
      },
      validator: {},
    });
  });

  it('should validate the form (mode=all)', () => {
    const { result } = renderHook(() => useInputs({ names: ['foo', 'bar'] }), {
      wrapper: ({ children }) => (
        <Form mode="all" useNativeValidation={false}>
          <input name="foo" />
          <input data-testid="rfv-input" name="bar" required />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    // Blur
    fireEvent.blur(screen.getByTestId('rfv-input'));
    expect(result.current.error).toEqual({
      error: 'Constraints not satisfied',
      global: false,
      id: 'bar',
      names: ['bar'],
    });
    expect(result.current.errors).toEqual({
      all: {
        bar: 'Constraints not satisfied',
      },
      global: {},
      main: {
        error: 'Constraints not satisfied',
        global: false,
        id: 'bar',
        names: ['bar'],
      },
      native: {
        bar: 'Constraints not satisfied',
      },
      validator: {},
    });
    // Change
    fireEvent.change(screen.getByTestId('rfv-input'), {
      target: { value: 'foo' },
    });
    act(() => jest.runAllTimers());
    expect(result.current.error).toEqual(undefined);
    expect(result.current.errors).toEqual({
      all: { bar: '' },
      global: {},
      native: { bar: '' },
      validator: {},
    });
  });

  it('should revalidate the form (revalidateMode=change)', () => {
    const { result } = renderHook(() => useInputs({ names: ['foo', 'bar'] }), {
      wrapper: ({ children }) => (
        <Form revalidateMode="change" useNativeValidation={false}>
          <input name="foo" />
          <input data-testid="rfv-input" name="bar" required />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    // Submit
    fireEvent.submit(screen.getByTestId('rfv-form'));
    expect(result.current.error).toEqual({
      error: 'Constraints not satisfied',
      global: false,
      id: 'bar',
      names: ['bar'],
    });
    expect(result.current.errors).toEqual({
      all: {
        bar: 'Constraints not satisfied',
        foo: '',
      },
      global: {},
      main: {
        error: 'Constraints not satisfied',
        global: false,
        id: 'bar',
        names: ['bar'],
      },
      native: {
        bar: 'Constraints not satisfied',
        foo: '',
      },
      validator: {},
    });
    // Change
    fireEvent.change(screen.getByTestId('rfv-input'), {
      target: { value: 'foo' },
    });
    act(() => jest.runAllTimers());
    expect(result.current.error).toEqual(undefined);
    expect(result.current.errors).toEqual({
      all: { bar: '', foo: '' },
      global: {},
      native: { bar: '', foo: '' },
      validator: {},
    });
  });

  it('should revalidate the form (revalidateMode=blur)', () => {
    const { result } = renderHook(() => useInputs({ names: ['foo', 'bar'] }), {
      wrapper: ({ children }) => (
        <Form revalidateMode="blur" useNativeValidation={false}>
          <input name="foo" />
          <input data-testid="rfv-input" name="bar" required />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    // Submit
    fireEvent.submit(screen.getByTestId('rfv-form'));
    expect(result.current.error).toEqual({
      error: 'Constraints not satisfied',
      global: false,
      id: 'bar',
      names: ['bar'],
    });
    expect(result.current.errors).toEqual({
      all: {
        bar: 'Constraints not satisfied',
        foo: '',
      },
      global: {},
      main: {
        error: 'Constraints not satisfied',
        global: false,
        id: 'bar',
        names: ['bar'],
      },
      native: {
        bar: 'Constraints not satisfied',
        foo: '',
      },
      validator: {},
    });
    // Change
    fireEvent.change(screen.getByTestId('rfv-input'), {
      target: { value: 'foo' },
    });
    act(() => jest.runAllTimers());
    expect(result.current.error).toEqual({
      error: 'Constraints not satisfied',
      global: false,
      id: 'bar',
      names: ['bar'],
    });
    expect(result.current.errors).toEqual({
      all: {
        bar: 'Constraints not satisfied',
        foo: '',
      },
      global: {},
      main: {
        error: 'Constraints not satisfied',
        global: false,
        id: 'bar',
        names: ['bar'],
      },
      native: {
        bar: 'Constraints not satisfied',
        foo: '',
      },
      validator: {},
    });
    // Blur
    fireEvent.blur(screen.getByTestId('rfv-input'));
    act(() => jest.runAllTimers());
    expect(result.current.error).toEqual(undefined);
    expect(result.current.errors).toEqual({
      all: { bar: '', foo: '' },
      global: {},
      native: { bar: '', foo: '' },
      validator: {},
    });
  });

  it('should reset the form', () => {
    const { result } = renderHook(() => useInputs({ names: ['foo', 'bar'] }), {
      wrapper: ({ children }) => (
        <Form useNativeValidation={false}>
          <input name="foo" />
          <input data-testid="rfv-input" name="bar" required />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    // Submit
    fireEvent.submit(screen.getByTestId('rfv-form'));
    expect(result.current.error).toBeDefined();
    // Reset
    fireEvent.reset(screen.getByTestId('rfv-form'));
    act(() => jest.runAllTimers());
    expect(result.current.error).toEqual(undefined);
  });
});
