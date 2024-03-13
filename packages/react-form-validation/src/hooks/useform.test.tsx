import type { FormEvent } from 'react';

import { renderHook } from '@testing-library/react';

import { useForm } from './useForm';

describe('useForm hook', () => {
  let form: HTMLFormElement;
  let input1: HTMLInputElement;
  let input2: HTMLInputElement;

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
  });

  it('should initialize data', () => {
    const { result } = renderHook(() => useForm());
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      native: {},
      validator: {},
    });
    expect(result.current.formProps.noValidate).toEqual(false);
    expect(result.current.formProps.onChange).toBeDefined();
    expect(result.current.formProps.onReset).toBeDefined();
    expect(result.current.formProps.onSubmit).toBeDefined();
    expect(result.current.formProps.ref).toEqual({ current: null });
    expect(result.current.messages).toEqual(undefined);
    expect(result.current.mode).toEqual('submit');
    expect(result.current.ref).toEqual({ current: null });
    expect(result.current.removeValidators).toBeDefined();
    expect(result.current.revalidateMode).toEqual('submit');
    expect(result.current.setValidators).toBeDefined();
    expect(result.current.subscribe).toBeDefined();
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
      native: {},
      validator: {},
    });
    expect(result.current.formProps.noValidate).toEqual(true);
    expect(result.current.formProps.onChange).toBeDefined();
    expect(result.current.formProps.onReset).toBeDefined();
    expect(result.current.formProps.onSubmit).toBeDefined();
    expect(result.current.formProps.ref).toEqual({ current: null });
    expect(result.current.messages).toEqual({ valueMissing: 'Custom message' });
    expect(result.current.mode).toEqual('all');
    expect(result.current.ref).toEqual({ current: null });
    expect(result.current.removeValidators).toBeDefined();
    expect(result.current.revalidateMode).toEqual('change');
    expect(result.current.setValidators).toBeDefined();
    expect(result.current.subscribe).toBeDefined();
    expect(result.current.useNativeValidation).toEqual(false);
    expect(result.current.validate).toBeDefined();
  });

  it('should call the onSubmit handler', () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        onSubmit,
      }),
    );
    // @ts-expect-error ignore
    result.current.ref.current = form;
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should call the onSubmit handler with default Values', () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        defaultValues: { foo: 42 },
        onSubmit,
      }),
    );
    // @ts-expect-error ignore
    result.current.ref.current = form;
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(onSubmit).toHaveBeenCalledWith(expect.any(Object), {
      bar: '',
      foo: 42,
    });
  });

  it('should call the onSubmit handler with the form values', () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        onSubmit,
      }),
    );
    input1.value = '42';
    input2.value = 'baz';
    // @ts-expect-error ignore
    result.current.ref.current = form;
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(onSubmit).toHaveBeenCalledWith(expect.any(Object), {
      bar: 'baz',
      foo: '42',
    });
  });

  it('should update the values with the onChange handler', () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        onSubmit,
      }),
    );
    input1.value = '42';
    input2.value = 'baz';
    // @ts-expect-error ignore
    result.current.ref.current = form;
    result.current.onChange('foo')(42);
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(onSubmit).toHaveBeenCalledWith(expect.any(Object), {
      bar: 'baz',
      foo: 42,
    });
  });

  it('should update the values with the onChange handler using the transformer', () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        onSubmit,
      }),
    );
    input1.value = '42';
    input2.value = 'baz';
    // @ts-expect-error ignore
    result.current.ref.current = form;
    result.current.onChange('foo', Number)({ target: { value: '42' } });
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(onSubmit).toHaveBeenCalledWith(expect.any(Object), {
      bar: 'baz',
      foo: 42,
    });
  });
});
