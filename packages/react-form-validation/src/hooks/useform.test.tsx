import { renderHook } from '@testing-library/react';

import { useForm } from './useForm';

describe('useForm hook', () => {
  it('should initialize data', () => {
    const { result } = renderHook(() => useForm());
    expect(result.current.errors).toEqual({
      all: {},
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
    expect(result.current.removeValidator).toBeDefined();
    expect(result.current.revalidateMode).toEqual('submit');
    expect(result.current.setValidator).toBeDefined();
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
    expect(result.current.removeValidator).toBeDefined();
    expect(result.current.revalidateMode).toEqual('change');
    expect(result.current.setValidator).toBeDefined();
    expect(result.current.subscribe).toBeDefined();
    expect(result.current.useNativeValidation).toEqual(false);
    expect(result.current.validate).toBeDefined();
  });
});
