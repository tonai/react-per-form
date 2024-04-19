import { fireEvent, renderHook, screen, waitFor } from '@testing-library/react';

import { Form } from '../components/Form/Form';

import { useInputs } from './useInputs';

describe('useInputs hook', () => {
  it('should return no errors', async () => {
    // Init
    const { result } = renderHook(() => useInputs({ names: ['foo', 'bar'] }), {
      wrapper: ({ children }) => (
        <Form useNativeValidation={false}>
          <input name="foo" />
          <input name="bar" />
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

  it('should return native errors (mode=submit)', async () => {
    // Init
    const { result } = renderHook(() => useInputs({ names: ['foo', 'bar'] }), {
      wrapper: ({ children }) => (
        <Form useNativeValidation={false}>
          <input name="foo" />
          <input name="bar" required />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() =>
      expect(result.current.error).toEqual({
        error: 'Constraints not satisfied',
        global: false,
        id: 'bar',
        names: ['bar'],
      }),
    );
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

  it('should return validator errors (mode=submit)', async () => {
    // Init
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
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() =>
      expect(result.current.error).toEqual({
        error: 'Validator error',
        global: false,
        id: 'foo,bar',
        names: ['foo', 'bar'],
      }),
    );
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

  it('should return custom error messages (mode=submit)', async () => {
    // Init
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
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() =>
      expect(result.current.error).toEqual({
        error: 'Custom error',
        global: false,
        id: 'bar',
        names: ['bar'],
      }),
    );
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

  it('should initialize default values', async () => {
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
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: '',
        foo: 0,
      },
      expect.any(Function),
    );
    onSubmit.mockClear();
    // Change
    fireEvent.change(screen.getByTestId('foo'), { target: { value: '42' } });
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: '',
        foo: 42,
      },
      expect.any(Function),
    );
  });

  it('should trigger the validator when the value change', async () => {
    const validator = jest.fn();
    // Init
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
    const names = ['foo', 'bar'];
    const onChangeOptOut = ['foo'];
    const validators = { foo: validator };
    // Init
    renderHook(() => useInputs({ names, onChangeOptOut, validators }), {
      wrapper: ({ children }) => (
        <Form onSubmit={onSubmit} useNativeValidation={false}>
          <input data-testid="foo" name="foo" />
          <input name="bar" />
          {children}
        </Form>
      ),
    });
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
    const validator = jest.fn();
    // Init
    const { result } = renderHook(
      () =>
        useInputs({
          names: ['foo', 'bar'],
          validators: { foo: validator },
        }),
      {
        wrapper: ({ children }) => (
          <Form mode="blur" useNativeValidation={false}>
            <input data-testid="foo" name="foo" required />
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
    const names = ['foo', 'bar'];
    const onBlurOptOut = ['foo'];
    const validators = { foo: validator };
    // Init
    renderHook(() => useInputs({ names, onBlurOptOut, validators }), {
      wrapper: ({ children }) => (
        <Form mode="blur" onSubmit={onSubmit} useNativeValidation={false}>
          <input data-testid="foo" name="foo" />
          <input name="bar" />
          {children}
        </Form>
      ),
    });
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

  it('should validate the form (mode=blur)', async () => {
    // Init
    const { result } = renderHook(() => useInputs({ names: ['foo', 'bar'] }), {
      wrapper: ({ children }) => (
        <Form mode="blur" useNativeValidation={false}>
          <input name="foo" />
          <input data-testid="rsf-input" name="bar" required />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Blur
    fireEvent.blur(screen.getByTestId('rsf-input'));
    await waitFor(() =>
      expect(result.current.error).toEqual({
        error: 'Constraints not satisfied',
        global: false,
        id: 'bar',
        names: ['bar'],
      }),
    );
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

  it('should validate the form (mode=change)', async () => {
    // Init
    const { result } = renderHook(() => useInputs({ names: ['foo', 'bar'] }), {
      wrapper: ({ children }) => (
        <Form mode="change" useNativeValidation={false}>
          <input name="foo" />
          <input data-testid="rsf-input" name="bar" required />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() =>
      expect(result.current.error).toEqual({
        error: 'Constraints not satisfied',
        global: false,
        id: 'bar',
        names: ['bar'],
      }),
    );
    // Change
    fireEvent.change(screen.getByTestId('rsf-input'), {
      target: { value: 'foo' },
    });
    await waitFor(() => expect(result.current.error).toEqual(undefined));
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
  });

  it('should validate the form (mode=all)', async () => {
    // Init
    const { result } = renderHook(() => useInputs({ names: ['foo', 'bar'] }), {
      wrapper: ({ children }) => (
        <Form mode="all" useNativeValidation={false}>
          <input name="foo" />
          <input data-testid="rsf-input" name="bar" required />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Blur
    fireEvent.blur(screen.getByTestId('rsf-input'));
    await waitFor(() =>
      expect(result.current.error).toEqual({
        error: 'Constraints not satisfied',
        global: false,
        id: 'bar',
        names: ['bar'],
      }),
    );
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
    await waitFor(() => expect(result.current.error).toEqual(undefined));
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
  });

  it('should revalidate the form (revalidateMode=change)', async () => {
    // Init
    const { result } = renderHook(() => useInputs({ names: ['foo', 'bar'] }), {
      wrapper: ({ children }) => (
        <Form revalidateMode="change" useNativeValidation={false}>
          <input name="foo" />
          <input data-testid="rsf-input" name="bar" required />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() =>
      expect(result.current.error).toEqual({
        error: 'Constraints not satisfied',
        global: false,
        id: 'bar',
        names: ['bar'],
      }),
    );
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
    await waitFor(() => expect(result.current.error).toEqual(undefined));
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
  });

  it('should revalidate the form (revalidateMode=blur)', async () => {
    // Init
    const { result } = renderHook(() => useInputs({ names: ['foo', 'bar'] }), {
      wrapper: ({ children }) => (
        <Form revalidateMode="blur" useNativeValidation={false}>
          <input name="foo" />
          <input data-testid="rsf-input" name="bar" required />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() =>
      expect(result.current.error).toEqual({
        error: 'Constraints not satisfied',
        global: false,
        id: 'bar',
        names: ['bar'],
      }),
    );
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
    await waitFor(() => expect(result.current.error).toEqual(undefined));
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
  });

  it('should reset the form', async () => {
    // Init
    const { result } = renderHook(() => useInputs({ names: ['foo', 'bar'] }), {
      wrapper: ({ children }) => (
        <Form useNativeValidation={false}>
          <input name="foo" />
          <input data-testid="rsf-input" name="bar" required />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() => expect(result.current.error).toBeDefined());
    // Reset
    fireEvent.reset(screen.getByTestId('rsf-form'));
    await waitFor(() => expect(result.current.error).toEqual(undefined));
  });
});
