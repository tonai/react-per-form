import { act, fireEvent, renderHook, screen } from '@testing-library/react';

import { Form } from '../components/Form/Form';

import { useFormValid } from './useFormValid';

jest.useFakeTimers();

describe('useFormValid hook', () => {
  it('should return true when the form is valid', () => {
    const { result } = renderHook(() => useFormValid(), {
      wrapper: ({ children }) => (
        <Form>
          <input />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    expect(result.current).toEqual(true);
  });

  it('should return false when the form is invalid', () => {
    const { result } = renderHook(() => useFormValid(), {
      wrapper: ({ children }) => (
        <Form>
          <input required />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    expect(result.current).toEqual(false);
  });

  it('should then return true is the form is updated and valid', () => {
    const { result } = renderHook(() => useFormValid(), {
      wrapper: ({ children }) => (
        <Form>
          <input data-testid="rsf-input" required />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    expect(result.current).toEqual(false);
    fireEvent.change(screen.getByTestId('rsf-input'), {
      target: { value: 'foo' },
    });
    act(() => jest.runAllTimers());
    expect(result.current).toEqual(true);
  });
});
