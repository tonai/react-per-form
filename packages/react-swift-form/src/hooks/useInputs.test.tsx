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
      manual: {},
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
    fireEvent.submit(screen.getByTestId('rsf-form'));
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
      manual: {},
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
          validators: () => 'Validator error',
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
    fireEvent.submit(screen.getByTestId('rsf-form'));
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
      manual: {},
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

  it('should return custom error messages (mode=submit)', () => {
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
    fireEvent.submit(screen.getByTestId('rsf-form'));
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
      manual: {},
      native: {
        bar: 'Custom error',
        foo: '',
      },
      validator: {},
    });
  });

  it('should initialize default values', () => {
    renderHook(
      () =>
        useInputs({
          defaultValues: { foo: 42 },
          names: ['foo', 'bar'],
        }),
      {
        wrapper: ({ children }) => (
          <Form useNativeValidation={false}>
            <input data-testid="foo" name="foo" />
            <input name="bar" required />
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
        useInputs({
          names: ['foo', 'bar'],
          transformers: { foo: Number },
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
    act(() => jest.runAllTimers());
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: '',
        foo: 0,
      },
      expect.any(Function),
    );
    // Change
    fireEvent.change(screen.getByTestId('foo'), { target: { value: '42' } });
    act(() => jest.runAllTimers());
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: '',
        foo: 42,
      },
      expect.any(Function),
    );
  });

  it('should trigger the validator when the value change', () => {
    const validator = jest.fn();
    renderHook(
      () =>
        useInputs({
          names: ['foo', 'bar'],
          validators: { foo: validator },
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
    expect(validator).toHaveBeenCalled();
  });

  it('should not trigger the validator when using onChangeOptOut', () => {
    const validator = jest.fn();
    renderHook(
      () =>
        useInputs({
          names: ['foo', 'bar'],
          onChangeOptOut: ['foo'],
          validators: { foo: validator },
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
        useInputs({
          names: ['foo', 'bar'],
          validators: { foo: validator },
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
    expect(validator).toHaveBeenCalled();
  });

  it('should not trigger the change when using onBlurOptOut', () => {
    const validator = jest.fn();
    renderHook(
      () =>
        useInputs({
          names: ['foo', 'bar'],
          onBlurOptOut: ['foo'],
          validators: { foo: validator },
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

  it('should validate the form (mode=blur)', () => {
    const { result } = renderHook(() => useInputs({ names: ['foo', 'bar'] }), {
      wrapper: ({ children }) => (
        <Form mode="blur" useNativeValidation={false}>
          <input name="foo" />
          <input data-testid="rsf-input" name="bar" required />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    // Blur
    fireEvent.blur(screen.getByTestId('rsf-input'));
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
      manual: {},
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
          <input data-testid="rsf-input" name="bar" required />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    // Change
    fireEvent.change(screen.getByTestId('rsf-input'), {
      target: { value: 'foo' },
    });
    act(() => jest.runAllTimers());
    expect(result.current.error).toEqual(undefined);
    expect(result.current.errors).toEqual({
      all: { bar: '' },
      global: {},
      manual: {},
      native: { bar: '' },
      validator: {},
    });
    // Change
    fireEvent.change(screen.getByTestId('rsf-input'), {
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
      manual: {},
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
          <input data-testid="rsf-input" name="bar" required />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    // Blur
    fireEvent.blur(screen.getByTestId('rsf-input'));
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
      manual: {},
      native: {
        bar: 'Constraints not satisfied',
      },
      validator: {},
    });
    // Change
    fireEvent.change(screen.getByTestId('rsf-input'), {
      target: { value: 'foo' },
    });
    act(() => jest.runAllTimers());
    expect(result.current.error).toEqual(undefined);
    expect(result.current.errors).toEqual({
      all: { bar: '' },
      global: {},
      manual: {},
      native: { bar: '' },
      validator: {},
    });
  });

  it('should revalidate the form (revalidateMode=change)', () => {
    const { result } = renderHook(() => useInputs({ names: ['foo', 'bar'] }), {
      wrapper: ({ children }) => (
        <Form revalidateMode="change" useNativeValidation={false}>
          <input name="foo" />
          <input data-testid="rsf-input" name="bar" required />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
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
      manual: {},
      native: {
        bar: 'Constraints not satisfied',
        foo: '',
      },
      validator: {},
    });
    // Change
    fireEvent.change(screen.getByTestId('rsf-input'), {
      target: { value: 'foo' },
    });
    act(() => jest.runAllTimers());
    expect(result.current.error).toEqual(undefined);
    expect(result.current.errors).toEqual({
      all: { bar: '', foo: '' },
      global: {},
      manual: {},
      native: { bar: '', foo: '' },
      validator: {},
    });
  });

  it('should revalidate the form (revalidateMode=blur)', () => {
    const { result } = renderHook(() => useInputs({ names: ['foo', 'bar'] }), {
      wrapper: ({ children }) => (
        <Form revalidateMode="blur" useNativeValidation={false}>
          <input name="foo" />
          <input data-testid="rsf-input" name="bar" required />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
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
      manual: {},
      native: {
        bar: 'Constraints not satisfied',
        foo: '',
      },
      validator: {},
    });
    // Change
    fireEvent.change(screen.getByTestId('rsf-input'), {
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
      manual: {},
      native: {
        bar: 'Constraints not satisfied',
        foo: '',
      },
      validator: {},
    });
    // Blur
    fireEvent.blur(screen.getByTestId('rsf-input'));
    act(() => jest.runAllTimers());
    expect(result.current.error).toEqual(undefined);
    expect(result.current.errors).toEqual({
      all: { bar: '', foo: '' },
      global: {},
      manual: {},
      native: { bar: '', foo: '' },
      validator: {},
    });
  });

  it('should reset the form', () => {
    const { result } = renderHook(() => useInputs({ names: ['foo', 'bar'] }), {
      wrapper: ({ children }) => (
        <Form useNativeValidation={false}>
          <input name="foo" />
          <input data-testid="rsf-input" name="bar" required />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    expect(result.current.error).toBeDefined();
    // Reset
    fireEvent.reset(screen.getByTestId('rsf-form'));
    act(() => jest.runAllTimers());
    expect(result.current.error).toEqual(undefined);
  });
});
