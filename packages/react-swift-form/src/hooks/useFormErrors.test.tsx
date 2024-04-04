import { act, fireEvent, renderHook, screen } from '@testing-library/react';

import { Form } from '../components/Form/Form';

import { useFormErrors } from './useFormErrors';

jest.useFakeTimers();

describe('useFormValid hook', () => {
  it('should not return any error when the form submitted and valid', () => {
    const { result } = renderHook(() => useFormErrors(), {
      wrapper: ({ children }) => (
        <Form useNativeValidation={false}>
          <input name="foo" />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    fireEvent.submit(screen.getByTestId('rsf-form'));
    act(() => jest.runAllTimers());
    expect(result.current).toEqual({
      all: { foo: '' },
      global: {},
      manual: {},
      native: { foo: '' },
      validator: {},
    });
  });

  it('should return the errors when the form submitted and invalid', () => {
    const { result } = renderHook(() => useFormErrors(), {
      wrapper: ({ children }) => (
        <Form useNativeValidation={false}>
          <input name="foo" required />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    fireEvent.submit(screen.getByTestId('rsf-form'));
    act(() => jest.runAllTimers());
    expect(result.current).toEqual({
      all: { foo: 'Constraints not satisfied' },
      global: {},
      main: {
        error: 'Constraints not satisfied',
        global: false,
        id: 'foo',
        names: ['foo'],
      },
      manual: {},
      native: { foo: 'Constraints not satisfied' },
      validator: {},
    });
  });
});
