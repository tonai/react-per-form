import type { FormEvent } from 'react';

import { renderHook, waitFor } from '@testing-library/react';

import { useForm } from './useForm';

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
    // Init
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
    expect(result.current.states).toEqual({ valid: false });
  });

  it('should initialize data with props', () => {
    // Init
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

  it('should call the onSubmitError handler (props)', async () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const onSubmitError = jest.fn();
    input1.setAttribute('required', '');
    // Init
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit,
        onSubmitError,
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() => expect(onSubmitError).toHaveBeenCalled());
    expect(preventDefault).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should call the onSubmit invalid callback (return)', async () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const onSubmitError = jest.fn();
    input1.setAttribute('required', '');
    // Init
    const { result } = renderHook(() => useForm({ form }));
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Submit
    const submitCallback = result.current.onSubmit(onSubmit, onSubmitError);
    submitCallback({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() => expect(onSubmitError).toHaveBeenCalled());
    expect(onSubmit).not.toHaveBeenCalled();
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should call the onSubmit handler (props)', async () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    // Init
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit,
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should call the onSubmit valid callback (return)', async () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    // Init
    const { result } = renderHook(() => useForm({ form }));
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Submit
    const submitCallback = result.current.onSubmit(onSubmit);
    submitCallback({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should call the onSubmit handler with default Values (props)', async () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    // Init
    const { result } = renderHook(() =>
      useForm({
        defaultValues: { foo: 42 },
        form,
        onSubmit,
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.any(Object),
        {
          bar: '',
          foo: '42',
        },
        expect.any(Function),
      ),
    );
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should call the onSubmit valid callback with default Values (return)', async () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    // Init
    const { result } = renderHook(() =>
      useForm({
        defaultValues: { foo: 42 },
        form,
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Submit
    const submitCallback = result.current.onSubmit(onSubmit);
    submitCallback({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.any(Object),
        {
          bar: '',
          foo: '42',
        },
        expect.any(Function),
      ),
    );
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should call the onSubmit handler with the form values (props)', async () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    // Init
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit,
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.any(Object),
        {
          bar: 'baz',
          foo: '42',
        },
        expect.any(Function),
      ),
    );
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should call the onSubmit valid callback with the form values (return)', async () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    // Init
    const { result } = renderHook(() => useForm({ form }));
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Submit
    const submitCallback = result.current.onSubmit(onSubmit);
    submitCallback({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.any(Object),
        {
          bar: 'baz',
          foo: '42',
        },
        expect.any(Function),
      ),
    );
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should call the validator on submit', async () => {
    const preventDefault = jest.fn();
    const validator = jest.fn();
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    // Init
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit,
        validators: { foo: validator },
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(validator).toHaveBeenCalledWith({ foo: '42' }, ['foo']),
    );
    expect(validator).toHaveBeenCalledTimes(2); // init + submit
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should call the validator on change', async () => {
    const validator = jest.fn();
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    // Init
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit,
        validators: { foo: validator },
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Change
    result.current.formProps.onChange({
      target: { name: 'foo', tagName: 'INPUT', value: '12' },
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(validator).toHaveBeenCalledWith({ foo: '12' }, ['foo']),
    );
    expect(validator).toHaveBeenCalledTimes(2); // init + change
  });

  it('should not call the validator twice when using the onChange handler', async () => {
    const validator = jest.fn();
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    // Init
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit,
        validators: { foo: validator },
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Change
    result.current.onChange(() => null, { name: 'foo' })(12);
    result.current.formProps.onChange({
      target: { name: 'foo', tagName: 'INPUT', value: '12' },
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(validator).toHaveBeenCalledWith({ foo: 12 }, ['foo']),
    );
    expect(validator).toHaveBeenCalledTimes(2); // init + change
  });

  it('should initialize the default value when using the onChange handler', async () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    input1.value = '12';
    input2.value = 'baz';
    // Init
    const { result } = renderHook(() =>
      useForm({
        defaultValues: { foo: 42 },
        form,
        onSubmit,
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Register onChange
    result.current.onChange(() => null, { name: 'foo' });
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.any(Object),
        {
          bar: 'baz',
          foo: 42,
        },
        expect.any(Function),
      ),
    );
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should reset the values with the onChange handler initializer', async () => {
    const preventDefault = jest.fn();
    const validator = jest.fn();
    const onSubmit = jest.fn();
    input1.value = '12';
    input2.value = 'baz';
    // Init
    const { result } = renderHook(() =>
      useForm({
        defaultValues: { foo: 42 },
        form,
        onSubmit,
        validators: { foo: validator },
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Register onChange
    result.current.onChange(() => null, { name: 'foo' });
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.any(Object),
        {
          bar: 'baz',
          foo: 42,
        },
        expect.any(Function),
      ),
    );
    onSubmit.mockClear();
    // Change
    result.current.formProps.onChange({
      target: { name: 'foo', tagName: 'INPUT', value: '12' },
    } as unknown as FormEvent<HTMLFormElement>);
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.any(Object),
        {
          bar: 'baz',
          foo: '12',
        },
        expect.any(Function),
      ),
    );
    onSubmit.mockClear();
    // Reset
    result.current.formProps.onReset(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.any(Object),
        {
          bar: 'baz',
          foo: 42,
        },
        expect.any(Function),
      ),
    );
  });

  it('should update the values with the onChange event', async () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    // Init
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit,
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Change
    result.current.formProps.onChange({
      target: { name: 'foo', tagName: 'INPUT', value: '12' },
    } as unknown as FormEvent<HTMLFormElement>);
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.any(Object),
        {
          bar: 'baz',
          foo: '12',
        },
        expect.any(Function),
      ),
    );
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should not update the values with the onChange event when using onChangeOptOut as string', async () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    // Init
    const { result } = renderHook(() =>
      useForm({
        form,
        onChangeOptOut: 'foo',
        onSubmit,
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Change
    result.current.formProps.onChange({
      target: { name: 'foo', tagName: 'INPUT', value: '12' },
    } as unknown as FormEvent<HTMLFormElement>);
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.any(Object),
        {
          bar: 'baz',
          foo: '42',
        },
        expect.any(Function),
      ),
    );
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should not update the values with the onChange event when using onChangeOptOut as array', async () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    // Init
    const { result } = renderHook(() =>
      useForm({
        form,
        onChangeOptOut: ['foo'],
        onSubmit,
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Change
    result.current.formProps.onChange({
      target: { name: 'foo', tagName: 'INPUT', value: '12' },
    } as unknown as FormEvent<HTMLFormElement>);
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.any(Object),
        {
          bar: 'baz',
          foo: '42',
        },
        expect.any(Function),
      ),
    );
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should update the values with the onChange callback', async () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    // Init
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit,
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Change
    result.current.onChange(() => null, { name: 'foo' })(42);
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.any(Object),
        {
          bar: 'baz',
          foo: 42,
        },
        expect.any(Function),
      ),
    );
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should throw an error when there is no name with the onChange callback', async () => {
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    // Init
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit,
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    expect(() => result.current.onChange(() => null)(42)).toThrow();
  });

  it('should update the values with the onChange callback using the transformer', async () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    input1.value = '42';
    input2.value = 'baz';
    // Init
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit,
        transformers: { foo: Number },
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Change
    result.current.onChange<number>(() => null, { name: 'foo' })({
      target: { tagName: 'INPUT', value: '42' },
    });
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.any(Object),
        {
          bar: 'baz',
          foo: 42,
        },
        expect.any(Function),
      ),
    );
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should set the value with the onChange handler', async () => {
    const onChange = jest.fn();
    // Init
    const { result } = renderHook(() => useForm({ form }));
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    result.current.onChange(onChange, { name: 'foo' })(42);
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(42));
  });

  it('should add a manual error with the onChange callback (mode=all)', async () => {
    const onError = jest.fn(() => 'error');
    // Init
    const { result } = renderHook(() =>
      useForm({
        form,
        mode: 'all',
        useNativeValidation: false,
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
    // Change
    result.current.onChange(() => null, { getError: onError, name: 'foo' })(42);
    await waitFor(() =>
      expect(result.current.errors).toEqual({
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        manual: { foo: 'error' },
        native: { foo: '' },
        validator: {},
      }),
    );
    expect(onError).toHaveBeenCalledWith(42);
  });

  it('should add a manual error with the onError callback (mode=all)', async () => {
    // Init
    const { result } = renderHook(() =>
      useForm({
        form,
        mode: 'all',
        useNativeValidation: false,
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
    // Error
    result.current.onError('foo')('error');
    await waitFor(() =>
      expect(result.current.errors).toEqual({
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        manual: { foo: 'error' },
        native: { foo: '' },
        validator: {},
      }),
    );
  });

  it('should add a manual error with the onError callback (mode=change)', async () => {
    // Init
    const { result } = renderHook(() =>
      useForm({
        form,
        mode: 'change',
        useNativeValidation: false,
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
    // Error
    result.current.onError('foo')('error');
    await waitFor(() =>
      expect(result.current.errors).toEqual({
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        manual: { foo: 'error' },
        native: { foo: '' },
        validator: {},
      }),
    );
  });

  it('should reset the values with the onReset handler', async () => {
    const preventDefault = jest.fn();
    const onReset = jest.fn();
    const onSubmit = jest.fn();
    // Init
    const { result } = renderHook(() =>
      useForm({
        form,
        onReset,
        onSubmit,
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Change
    result.current.onChange(() => null, { name: 'foo' })('12');
    // Reset
    result.current.formProps.onReset(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    await waitFor(() => expect(onReset).toHaveBeenCalled());
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.any(Object),
        {
          bar: '',
          foo: '',
        },
        expect.any(Function),
      ),
    );
    expect(input1.value).toEqual('');
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should reset the values with the onReset callback', async () => {
    const preventDefault = jest.fn();
    const onReset = jest.fn();
    const onSubmit = jest.fn();
    // Init
    const { result } = renderHook(() => useForm({ form, onSubmit }));
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Change
    result.current.onChange(() => null, { name: 'foo' })('12');
    // Reset
    result.current.onReset(onReset)(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    await waitFor(() => expect(onReset).toHaveBeenCalled());
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.any(Object),
        {
          bar: '',
          foo: '',
        },
        expect.any(Function),
      ),
    );
    expect(input1.value).toEqual('');
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should reset the form using the reset function', async () => {
    const preventDefault = jest.fn();
    const onReset = jest.fn();
    const onSubmit = jest.fn();
    // Init
    const { result } = renderHook(() => useForm({ form, onReset, onSubmit }));
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Change
    result.current.onChange(() => null, { name: 'foo' })('12');
    // Reset
    result.current.reset();
    result.current.formProps.onReset(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.any(Object),
        {
          bar: '',
          foo: '',
        },
        expect.any(Function),
      ),
    );
    expect(input1.value).toEqual('');
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should reset the form with specific values using the reset function', async () => {
    const preventDefault = jest.fn();
    const onReset = jest.fn();
    const onSubmit = jest.fn();
    // Init
    const { result } = renderHook(() => useForm({ form, onReset, onSubmit }));
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Change
    result.current.onChange(() => null, { name: 'foo' })('12');
    // Reset
    result.current.reset({ foo: 42 });
    result.current.formProps.onReset(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.any(Object),
        {
          bar: '',
          foo: 42,
        },
        expect.any(Function),
      ),
    );
    expect(input1.value).toEqual('42');
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should set the default values', async () => {
    // Init
    renderHook(() =>
      useForm({
        defaultValues: { bar: 'baz', baz: true },
        form,
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    expect(input2.value).toEqual('baz');
    expect(input3.checked).toEqual(true);
  });

  it('should reset the values with defaultValues and the onReset handler return values', async () => {
    const preventDefault = jest.fn();
    const onReset = jest.fn(() => ({ foo: 42 }));
    const onSubmit = jest.fn();
    // Init
    const { result } = renderHook(() =>
      useForm({
        defaultValues: { bar: 'baz' },
        form,
        onReset,
        onSubmit,
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Change
    result.current.onChange(() => null, { name: 'foo' })(12);
    // Reset
    result.current.formProps.onReset(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    await waitFor(() => expect(onReset).toHaveBeenCalled());
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.any(Object),
        {
          bar: 'baz',
          foo: 42,
        },
        expect.any(Function),
      ),
    );
    expect(input1.value).toEqual('42');
    expect(input2.value).toEqual('baz');
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should reset the values with defaultValues and the onReset callback return values', async () => {
    const preventDefault = jest.fn();
    const onReset = jest.fn(() => ({ foo: 42 }));
    const onSubmit = jest.fn();
    // Init
    const { result } = renderHook(() =>
      useForm({
        defaultValues: { bar: 'baz' },
        form,
        onSubmit,
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Change
    result.current.onChange(() => null, { name: 'foo' })(12);
    // Reset
    result.current.onReset(onReset)(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    await waitFor(() => expect(onReset).toHaveBeenCalled());
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.any(Object),
        {
          bar: 'baz',
          foo: 42,
        },
        expect.any(Function),
      ),
    );
    expect(input1.value).toEqual('42');
    expect(input2.value).toEqual('baz');
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should call the watch on value change', async () => {
    const spy = jest.fn();
    // Init
    const { result } = renderHook(() => useForm({ form }));
    result.current.watch(spy);
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    spy.mockClear();
    // Change
    result.current.onChange(() => null, { name: 'foo' })(12);
    await waitFor(() => expect(spy).toHaveBeenCalledWith({ bar: '', foo: 12 }));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call the watch on reset', async () => {
    const spy = jest.fn();
    // Init
    const { result } = renderHook(() => useForm({ form }));
    result.current.watch(spy);
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    spy.mockClear();
    // Change
    result.current.onChange(() => null, { name: 'foo' })(12);
    await waitFor(() => expect(spy).toHaveBeenCalledWith({ bar: '', foo: 12 }));
    spy.mockClear();
    // Reset
    result.current.onReset()({} as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() => expect(spy).toHaveBeenCalledWith({ bar: '', foo: '' }));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call not call the watch if value is the same', async () => {
    const spy = jest.fn();
    // Init
    const { result } = renderHook(() => useForm({ form }));
    result.current.watch(spy);
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    spy.mockClear();
    // Change
    result.current.onChange(() => null, { name: 'foo' })(12);
    await waitFor(() => expect(spy).toHaveBeenCalledWith({ bar: '', foo: 12 }));
    // Change
    result.current.onChange(() => null, { name: 'foo' })(12);
    // Change
    result.current.onChange(() => null, { name: 'foo' })(42);
    await waitFor(() => expect(spy).toHaveBeenCalledWith({ bar: '', foo: 42 }));
    expect(spy).toHaveBeenCalledTimes(2); // One time for 12 and one time for 42
  });

  it('should validate the form', async () => {
    // Init
    const { result } = renderHook(() => useForm({ form }));
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Validate
    const [isValid, errors] = await result.current.validate();
    expect(isValid).toEqual(true);
    expect(errors).toEqual({
      all: { bar: '', baz: '', foo: '' },
      global: {},
      manual: {},
      native: { bar: '', baz: '', foo: '' },
      validator: {},
    });
  });

  it('should not validate the form', async () => {
    input1.setAttribute('required', '');
    // Init
    const { result } = renderHook(() => useForm({ form }));
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Validate
    const [isValid, errors] = await result.current.validate();
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

  it('should validate the field', async () => {
    input1.setAttribute('required', '');
    // Init
    const { result } = renderHook(() => useForm({ form }));
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    // Validate
    const [isValid, errors] = await result.current.validate(
      false,
      false,
      false,
      ['bar'],
    );
    expect(isValid).toEqual(false);
    expect(errors).toEqual({
      all: { bar: '' },
      global: {},
      manual: {},
      native: { bar: '' },
      validator: {},
    });
  });

  it('should reset the form from the onSubmit handler (props)', async () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn((_a, _b, reset: () => void) => reset());
    input1.value = 'bar';
    // Init
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmit,
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    expect(input1.value).toEqual('bar');
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(input1.value).toEqual('');
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should reset the form from the onSubmitError handler (props)', async () => {
    const preventDefault = jest.fn();
    const onSubmitError = jest.fn((_a, _b, reset: () => void) => reset());
    input1.value = 'bar';
    input2.setAttribute('required', '');
    // Init
    const { result } = renderHook(() =>
      useForm({
        form,
        onSubmitError,
        useNativeValidation: false,
      }),
    );
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    expect(input1.value).toEqual('bar');
    // Submit
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() => expect(onSubmitError).toHaveBeenCalled());
    expect(input1.value).toEqual('');
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should reset the form from the onSubmit valid callback (return)', async () => {
    const preventDefault = jest.fn();
    input1.value = 'bar';
    // Init
    const { result } = renderHook(() => useForm({ form }));
    await waitFor(() => expect(form.dataset.rsf).toEqual('init'));
    const submitCallback = result.current.onSubmit((_a, _b, reset) => reset());
    expect(input1.value).toEqual('bar');
    // Submit
    submitCallback({ preventDefault } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() => expect(input1.value).toEqual(''));
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should reset the form from the onSubmit invalid callback (return)', async () => {
    const preventDefault = jest.fn();
    input1.value = 'bar';
    input1.setAttribute('required', '');
    input2.setAttribute('required', '');
    // Init
    const { result } = renderHook(() => useForm({ form }));
    await waitFor(() => {
      expect(form.dataset.rsf).toEqual('init');
    });
    // Submit
    const submitCallback = result.current.onSubmit(
      () => undefined,
      (_a, _b, reset) => reset(),
    );
    expect(input1.value).toEqual('bar');
    submitCallback({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    await waitFor(() => expect(preventDefault).toHaveBeenCalled());
    expect(input1.value).toEqual('');
    expect(preventDefault).toHaveBeenCalled();
  });
});
