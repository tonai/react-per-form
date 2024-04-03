import { act, fireEvent, renderHook, screen } from '@testing-library/react';

import { Form } from '../components/Form/Form';

import { useWatch } from './useWatch';

jest.useFakeTimers();

describe('useWatch hook', () => {
  it('should return the form initial values', () => {
    const { result } = renderHook(() => useWatch(), {
      wrapper: ({ children }) => (
        <Form>
          <input defaultValue="bar" name="foo" />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    expect(result.current).toEqual({ foo: 'bar' });
  });

  it('should return the form filtered values', () => {
    const { result } = renderHook(() => useWatch(['foo']), {
      wrapper: ({ children }) => (
        <Form>
          <input defaultValue="foo" name="foo" />
          <input defaultValue="bar" name="bar" />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    expect(result.current).toEqual({ foo: 'foo' });
  });

  it('should return the form changed values', () => {
    const { result } = renderHook(() => useWatch(['foo']), {
      wrapper: ({ children }) => (
        <Form>
          <input data-testid="foo" defaultValue="bar" name="foo" />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    fireEvent.change(screen.getByTestId('foo'), { target: { value: 'baz' } });
    act(() => jest.runAllTimers());
    expect(result.current).toEqual({ foo: 'baz' });
  });
});
