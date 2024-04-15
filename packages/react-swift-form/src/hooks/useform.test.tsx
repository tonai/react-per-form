import type { FormEvent } from 'react';

import { act, renderHook } from '@testing-library/react';

import { useForm } from './useForm';

jest.useFakeTimers();

describe('useForm hook', () => {
  let form: HTMLFormElement;
  let input1: HTMLInputElement;
  let input2: HTMLInputElement;
  let input3: HTMLInputElement;

  beforeEach(() => {
    form = document.createElement('form');
    input1 = document.createElement('input');
    input1.setAttribute('name', 'foo');
    input1.setAttribute('value', '');
    form.appendChild(input1);
    input2 = document.createElement('input');
    input2.setAttribute('name', 'bar');
    input2.setAttribute('value', '');
    form.appendChild(input2);
    input3 = document.createElement('input');
    input3.setAttribute('name', 'baz');
    input3.setAttribute('type', 'checkbox');
    form.appendChild(input3);
  });

  it('should initialize data', () => {
    const { result } = renderHook(() => useForm());
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
    expect(result.current.form).toEqual({ current: null });
    expect(result.current.formProps.noValidate).toEqual(false);
    expect(result.current.formProps.onChange).toBeDefined();
    expect(result.current.formProps.onReset).toBeDefined();
    expect(result.current.formProps.onSubmit).toBeDefined();
    expect(result.current.formProps.ref).toEqual({ current: null });
    expect(result.current.messages).toEqual(undefined);
    expect(result.current.mode).toEqual('submit');
    expect(result.current.register).toBeDefined();
    expect(result.current.revalidateMode).toEqual('submit');
    expect(result.current.states).toEqual({ valid: false });
    expect(result.current.subscribe).toBeDefined();
    expect(result.current.unregister).toBeDefined();
    expect(result.current.useNativeValidation).toEqual(true);
    expect(result.current.validate).toBeDefined();
  });

  it('should initialize data with props', () => {
    const { result } = renderHook(() =>
      useForm({
        messages: { valueMissing: 'Custom message' },
        mode: 'all',
        revalidateMode: 'change',
        useNativeValidation: false,
      }),
    );
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
    expect(result.current.form).toEqual({ current: null });
    expect(result.current.formProps.noValidate).toEqual(true);
    expect(result.current.formProps.onChange).toBeDefined();
    expect(result.current.formProps.onReset).toBeDefined();
    expect(result.current.formProps.onSubmit).toBeDefined();
    expect(result.current.formProps.ref).toEqual({ current: null });
    expect(result.current.messages).toEqual({ valueMissing: 'Custom message' });
    expect(result.current.mode).toEqual('all');
    expect(result.current.register).toBeDefined();
    expect(result.current.revalidateMode).toEqual('change');
    expect(result.current.states).toEqual({ valid: false });
    expect(result.current.subscribe).toBeDefined();
    expect(result.current.unregister).toBeDefined();
    expect(result.current.useNativeValidation).toEqual(false);
    expect(result.current.validate).toBeDefined();
  });

  it('should call the onSubmitError handler (props)', () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const onSubmitError = jest.fn();
    input1.setAttribute('required', '');
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit,
        onSubmitError,
      }),
    );
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(preventDefault).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onSubmitError).toHaveBeenCalled();
  });

  it('should call the onSubmit invalid callback (return)', () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const onSubmitError = jest.fn();
    const { result } = renderHook(() => useForm({ form }));
    input1.setAttribute('required', '');
    // Submit
    const submitCallback = result.current.onSubmit(onSubmit, onSubmitError);
    submitCallback({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(preventDefault).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onSubmitError).toHaveBeenCalled();
  });

  it('should call the onSubmit handler (props)', () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit,
      }),
    );
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should call the onSubmit valid callback (return)', () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() => useForm({ form }));
    // Submit
    const submitCallback = result.current.onSubmit(onSubmit);
    submitCallback({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should call the onSubmit handler with default Values (props)', () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        defaultValues: { foo: 42 },
        form,
        onSubmit,
      }),
    );
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: '',
        foo: '42',
      },
      expect.any(Function),
    );
  });

  it('should call the onSubmit valid callback with default Values (return)', () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        defaultValues: { foo: 42 },
        form,
      }),
    );
    // Submit
    const submitCallback = result.current.onSubmit(onSubmit);
    submitCallback({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: '',
        foo: '42',
      },
      expect.any(Function),
    );
  });

  it('should call the onSubmit handler with the form values (props)', () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit,
      }),
    );
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: 'baz',
        foo: '42',
      },
      expect.any(Function),
    );
  });

  it('should call the onSubmit valid callback with the form values (return)', () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    const { result } = renderHook(() => useForm({ form }));
    // Submit
    const submitCallback = result.current.onSubmit(onSubmit);
    submitCallback({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: 'baz',
        foo: '42',
      },
      expect.any(Function),
    );
  });

  it('should call the validator on submit', () => {
    const validator = jest.fn();
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit,
        validators: { foo: validator },
      }),
    );
    // Submit
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(validator).toHaveBeenCalledTimes(2); // init + submit
    expect(validator).toHaveBeenCalledWith({ foo: '42' }, ['foo']);
  });

  it('should call the validator on change', () => {
    const validator = jest.fn();
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit,
        validators: { foo: validator },
      }),
    );
    // Change
    result.current.formProps.onChange({
      target: { name: 'foo', tagName: 'INPUT', value: '12' },
    } as unknown as FormEvent<HTMLFormElement>);
    act(() => jest.runAllTimers());
    expect(validator).toHaveBeenCalledTimes(2); // init + change
    expect(validator).toHaveBeenCalledWith({ foo: '12' }, ['foo']);
  });

  it('should not call the validator twice when using the onChange handler', () => {
    const validator = jest.fn();
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit,
        validators: { foo: validator },
      }),
    );
    // Change
    result.current.onChange(() => null, { name: 'foo' })(12);
    result.current.formProps.onChange({
      target: { name: 'foo', tagName: 'INPUT', value: '12' },
    } as unknown as FormEvent<HTMLFormElement>);
    act(() => jest.runAllTimers());
    expect(validator).toHaveBeenCalledTimes(2); // init + change
    expect(validator).toHaveBeenCalledWith({ foo: 12 }, ['foo']);
  });

  it('should initialize the default value when using the onChange handler', () => {
    const onSubmit = jest.fn();
    input1.value = '12';
    input2.value = 'baz';
    const { result } = renderHook(() =>
      useForm({
        defaultValues: { foo: 42 },
        form,
        onSubmit,
      }),
    );
    // Register onChange
    result.current.onChange(() => null, { name: 'foo' });
    act(() => jest.runAllTimers());
    // Submit
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: 'baz',
        foo: 42,
      },
      expect.any(Function),
    );
  });

  it('should reset the values with the onChange handler initializer', () => {
    const validator = jest.fn();
    const onSubmit = jest.fn();
    input1.value = '12';
    input2.value = 'baz';
    const { result } = renderHook(() =>
      useForm({
        defaultValues: { foo: 42 },
        form,
        onSubmit,
        validators: { foo: validator },
      }),
    );
    // Register onChange
    result.current.onChange(() => null, { name: 'foo' });
    act(() => jest.runAllTimers());
    // Submit
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: 'baz',
        foo: 42,
      },
      expect.any(Function),
    );
    // Change
    result.current.formProps.onChange({
      target: { name: 'foo', tagName: 'INPUT', value: '12' },
    } as unknown as FormEvent<HTMLFormElement>);
    act(() => jest.runAllTimers());
    // Submit
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: 'baz',
        foo: '12',
      },
      expect.any(Function),
    );
    // Reset
    result.current.formProps.onReset(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    act(() => jest.runAllTimers());
    // Submit
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: 'baz',
        foo: 42,
      },
      expect.any(Function),
    );
  });

  it('should update the values with the onChange event', () => {
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit,
      }),
    );
    // Change
    result.current.formProps.onChange({
      target: { name: 'foo', tagName: 'INPUT', value: '12' },
    } as unknown as FormEvent<HTMLFormElement>);
    act(() => jest.runAllTimers());
    // Submit
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: 'baz',
        foo: '12',
      },
      expect.any(Function),
    );
  });

  it('should not update the values with the onChange event when using onChangeOptOut as string', () => {
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    const { result } = renderHook(() =>
      useForm({
        form,
        onChangeOptOut: 'foo',
        onSubmit,
      }),
    );
    // Change
    result.current.formProps.onChange({
      target: { name: 'foo', tagName: 'INPUT', value: '12' },
    } as unknown as FormEvent<HTMLFormElement>);
    act(() => jest.runAllTimers());
    // Submit
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: 'baz',
        foo: '42',
      },
      expect.any(Function),
    );
  });

  it('should not update the values with the onChange event when using onChangeOptOut as array', () => {
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    const { result } = renderHook(() =>
      useForm({
        form,
        onChangeOptOut: ['foo'],
        onSubmit,
      }),
    );
    // Change
    result.current.formProps.onChange({
      target: { name: 'foo', tagName: 'INPUT', value: '12' },
    } as unknown as FormEvent<HTMLFormElement>);
    act(() => jest.runAllTimers());
    // Submit
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: 'baz',
        foo: '42',
      },
      expect.any(Function),
    );
  });

  it('should update the values with the onChange callback', () => {
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit,
      }),
    );
    // Change
    result.current.onChange(() => null, { name: 'foo' })(42);
    act(() => jest.runAllTimers());
    // Submit
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: 'baz',
        foo: 42,
      },
      expect.any(Function),
    );
  });

  it('should throw an error when there is no name with the onChange callback', () => {
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit,
      }),
    );
    expect(() => result.current.onChange(() => null)(42)).toThrow();
  });

  it('should update the values with the onChange callback using the transformer', () => {
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit,
        transformers: { foo: Number },
      }),
    );
    // Change
    result.current.onChange<number>(() => null, { name: 'foo' })({
      target: { tagName: 'INPUT', value: '42' },
    });
    act(() => jest.runAllTimers());
    // Submit
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: 'baz',
        foo: 42,
      },
      expect.any(Function),
    );
  });

  it('should set the value with the onChange handler', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useForm({ form }));
    result.current.onChange(onChange, { name: 'foo' })(42);
    act(() => jest.runAllTimers());
    expect(onChange).toHaveBeenCalledWith(42);
  });

  it('should add a manual error with the onChange callback (mode=all)', () => {
    const onError = jest.fn(() => 'error');
    const { result } = renderHook(() =>
      useForm({
        form,
        mode: 'all',
        useNativeValidation: false,
      }),
    );
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
    // Change
    result.current.onChange(() => null, { getError: onError, name: 'foo' })(42);
    act(() => jest.runAllTimers());
    expect(onError).toHaveBeenCalledWith(42);
    expect(result.current.errors).toEqual({
      all: { foo: 'error' },
      global: {},
      main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
      manual: { foo: 'error' },
      native: { foo: '' },
      validator: {},
    });
  });

  it('should add a manual error with the onError callback (mode=all)', () => {
    const { result } = renderHook(() =>
      useForm({
        form,
        mode: 'all',
        useNativeValidation: false,
      }),
    );
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
    // Error
    result.current.onError('foo')('error');
    act(() => jest.runAllTimers());
    expect(result.current.errors).toEqual({
      all: { foo: 'error' },
      global: {},
      main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
      manual: { foo: 'error' },
      native: { foo: '' },
      validator: {},
    });
  });

  it('should add a manual error with the onError callback (mode=change)', () => {
    const { result } = renderHook(() =>
      useForm({
        form,
        mode: 'change',
        useNativeValidation: false,
      }),
    );
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
    // Error
    result.current.onError('foo')('error');
    act(() => jest.runAllTimers());
    expect(result.current.errors).toEqual({
      all: { foo: 'error' },
      global: {},
      main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
      manual: { foo: 'error' },
      native: { foo: '' },
      validator: {},
    });
  });

  it('should reset the values with the onReset handler', () => {
    const onReset = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        form,
        onReset,
        onSubmit,
      }),
    );
    // Change
    result.current.onChange(() => null, { name: 'foo' })('12');
    act(() => jest.runAllTimers());
    // Reset
    result.current.formProps.onReset(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    act(() => jest.runAllTimers());
    expect(onReset).toHaveBeenCalled();
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: '',
        foo: '',
      },
      expect.any(Function),
    );
    expect(input1.value).toEqual('');
  });

  it('should reset the values with the onReset callback', () => {
    const onReset = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() => useForm({ form, onSubmit }));
    // Change
    result.current.onChange(() => null, { name: 'foo' })('12');
    act(() => jest.runAllTimers());
    // Reset
    result.current.onReset(onReset)(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    act(() => jest.runAllTimers());
    expect(onReset).toHaveBeenCalled();
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: '',
        foo: '',
      },
      expect.any(Function),
    );
    expect(input1.value).toEqual('');
  });

  it('should reset the form using the reset function', () => {
    const onReset = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() => useForm({ form, onReset, onSubmit }));
    // Change
    result.current.onChange(() => null, { name: 'foo' })('12');
    act(() => jest.runAllTimers());
    // Reset
    result.current.reset();
    result.current.formProps.onReset(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    act(() => jest.runAllTimers());
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: '',
        foo: '',
      },
      expect.any(Function),
    );
    expect(input1.value).toEqual('');
  });

  it('should reset the form with specific values using the reset function', () => {
    const onReset = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() => useForm({ form, onReset, onSubmit }));
    // Change
    result.current.onChange(() => null, { name: 'foo' })('12');
    act(() => jest.runAllTimers());
    // Reset
    result.current.reset({ foo: 42 });
    result.current.formProps.onReset(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    act(() => jest.runAllTimers());
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: '',
        foo: 42,
      },
      expect.any(Function),
    );
    expect(input1.value).toEqual('42');
  });

  it('should set the default values', () => {
    renderHook(() =>
      useForm({
        defaultValues: { bar: 'baz', baz: true },
        form,
      }),
    );
    expect(input2.value).toEqual('baz');
    expect(input3.checked).toEqual(true);
  });

  it('should reset the values with defaultValues and the onReset handler return values', () => {
    const onReset = jest.fn(() => ({ foo: 42 }));
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        defaultValues: { bar: 'baz' },
        form,
        onReset,
        onSubmit,
      }),
    );
    // Change
    result.current.onChange(() => null, { name: 'foo' })(12);
    act(() => jest.runAllTimers());
    // Reset
    result.current.formProps.onReset(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    act(() => jest.runAllTimers());
    expect(onReset).toHaveBeenCalled();
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: 'baz',
        foo: 42,
      },
      expect.any(Function),
    );
    expect(input1.value).toEqual('42');
    expect(input2.value).toEqual('baz');
  });

  it('should reset the values with defaultValues and the onReset callback return values', () => {
    const onReset = jest.fn(() => ({ foo: 42 }));
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        defaultValues: { bar: 'baz' },
        form,
        onSubmit,
      }),
    );
    // Change
    result.current.onChange(() => null, { name: 'foo' })(12);
    act(() => jest.runAllTimers());
    // Reset
    result.current.onReset(onReset)(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    act(() => jest.runAllTimers());
    expect(onReset).toHaveBeenCalled();
    // Submit
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      {
        bar: 'baz',
        foo: 42,
      },
      expect.any(Function),
    );
    expect(input1.value).toEqual('42');
    expect(input2.value).toEqual('baz');
  });

  it('should call the watch on value change', () => {
    const spy = jest.fn();
    const { result } = renderHook(() => useForm({ form }));
    // Watch
    result.current.watch(spy);
    spy.mockClear();
    // Change
    result.current.onChange(() => null, { name: 'foo' })(12);
    act(() => jest.runAllTimers());
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ bar: '', foo: 12 });
  });

  it('should call the watch on reset', () => {
    const spy = jest.fn();
    const { result } = renderHook(() => useForm({ form }));
    // Watch
    result.current.watch(spy);
    spy.mockClear();
    // Change
    result.current.onChange(() => null, { name: 'foo' })(12);
    act(() => jest.runAllTimers());
    spy.mockClear();
    // Reset
    result.current.onReset()({} as unknown as FormEvent<HTMLFormElement>);
    act(() => jest.runAllTimers());
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ bar: '', foo: '' });
  });

  it('should call not call the watch if value is the same', () => {
    const spy = jest.fn();
    const { result } = renderHook(() => useForm({ form }));
    // Watch
    result.current.watch(spy);
    spy.mockClear();
    // Change
    result.current.onChange(() => null, { name: 'foo' })(12);
    act(() => jest.runAllTimers());
    // Change
    result.current.onChange(() => null, { name: 'foo' })(12);
    act(() => jest.runAllTimers());
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ bar: '', foo: 12 });
  });

  it('should validate the form', () => {
    const { result } = renderHook(() => useForm({ form }));
    // Validate
    const [isValid, errors] = result.current.validate();
    expect(isValid).toEqual(true);
    expect(errors).toEqual({
      all: { bar: '', baz: '', foo: '' },
      global: {},
      manual: {},
      native: { bar: '', baz: '', foo: '' },
      validator: {},
    });
  });

  it('should not validate the form', () => {
    input1.setAttribute('required', '');
    const { result } = renderHook(() => useForm({ form }));
    // Validate
    const [isValid, errors] = result.current.validate();
    expect(isValid).toEqual(false);
    expect(errors).toEqual({
      all: { bar: '', baz: '', foo: 'Constraints not satisfied' },
      global: {},
      main: {
        error: 'Constraints not satisfied',
        global: false,
        id: 'foo',
        names: ['foo'],
      },
      manual: {},
      native: { bar: '', baz: '', foo: 'Constraints not satisfied' },
      validator: {},
    });
  });

  it('should validate the field', () => {
    input1.setAttribute('required', '');
    const { result } = renderHook(() => useForm({ form }));
    // Validate
    const [isValid, errors] = result.current.validate(false, false, false, [
      'bar',
    ]);
    expect(isValid).toEqual(false);
    expect(errors).toEqual({
      all: { bar: '' },
      global: {},
      manual: {},
      native: { bar: '' },
      validator: {},
    });
  });

  it('should reset the form from the onSubmit handler (props)', () => {
    const preventDefault = jest.fn();
    input1.value = 'bar';
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit: (_a, _b, reset) => reset(),
      }),
    );
    expect(input1.value).toEqual('bar');
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(input1.value).toEqual('');
  });

  it('should reset the form from the onSubmitError handler (props)', () => {
    const preventDefault = jest.fn();
    input1.value = 'bar';
    input2.setAttribute('required', '');
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmitError: (_a, _b, reset) => reset(),
        useNativeValidation: false,
      }),
    );
    expect(input1.value).toEqual('bar');
    // Submit
    act(() =>
      result.current.formProps.onSubmit({
        preventDefault,
      } as unknown as FormEvent<HTMLFormElement>),
    );
    expect(preventDefault).toHaveBeenCalled();
    expect(input1.value).toEqual('');
  });

  it('should reset the form from the onSubmit valid callback (return)', () => {
    const preventDefault = jest.fn();
    input1.value = 'bar';
    const { result } = renderHook(() => useForm({ form }));
    const submitCallback = result.current.onSubmit((_a, _b, reset) => reset());
    expect(input1.value).toEqual('bar');
    // Submit
    submitCallback({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(input1.value).toEqual('');
  });

  it('should reset the form from the onSubmit invalid callback (return)', () => {
    const preventDefault = jest.fn();
    input1.value = 'bar';
    input2.setAttribute('required', '');
    const { result } = renderHook(() => useForm({ form }));
    input1.setAttribute('required', '');
    // Submit
    const submitCallback = result.current.onSubmit(
      () => null,
      (_a, _b, reset) => reset(),
    );
    expect(input1.value).toEqual('bar');
    submitCallback({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(preventDefault).toHaveBeenCalled();
    expect(input1.value).toEqual('');
  });
});
