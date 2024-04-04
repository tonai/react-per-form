import { act, fireEvent, renderHook, screen } from '@testing-library/react';

import { Form } from '../components/Form/Form';

import { useSubscribe } from './useSubscribe';

jest.useFakeTimers();

describe('useSubscribe hook', () => {
  it('should call the callback when the form is initialized', () => {
    const spy = jest.fn();
    renderHook(() => useSubscribe(spy), {
      wrapper: ({ children }) => (
        <Form>
          <input defaultValue="bar" name="foo" />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    expect(spy).toHaveBeenCalledWith({
      form: expect.any(HTMLFormElement) as HTMLFormElement,
      names: undefined,
      prevValues: {},
      values: { foo: 'bar' },
    });
  });

  it('should call the callback with filtered values (string)', () => {
    const spy = jest.fn();
    renderHook(() => useSubscribe(spy, 'foo'), {
      wrapper: ({ children }) => (
        <Form>
          <input defaultValue="foo" name="foo" />
          <input defaultValue="bar" name="bar" />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    expect(spy).toHaveBeenCalledWith({
      form: expect.any(HTMLFormElement) as HTMLFormElement,
      names: ['foo'],
      prevValues: {},
      values: { foo: 'foo' },
    });
  });

  it('should call the callback with filtered values (array)', () => {
    const spy = jest.fn();
    renderHook(() => useSubscribe(spy, ['foo']), {
      wrapper: ({ children }) => (
        <Form>
          <input defaultValue="foo" name="foo" />
          <input defaultValue="bar" name="bar" />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    expect(spy).toHaveBeenCalledWith({
      form: expect.any(HTMLFormElement) as HTMLFormElement,
      names: ['foo'],
      prevValues: {},
      values: { foo: 'foo' },
    });
  });

  it('should call the callback when the form is changed', () => {
    const spy = jest.fn();
    renderHook(() => useSubscribe(spy), {
      wrapper: ({ children }) => (
        <Form>
          <input data-testid="foo" defaultValue="bar" name="foo" />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    spy.mockClear();
    fireEvent.change(screen.getByTestId('foo'), { target: { value: 'baz' } });
    act(() => jest.runAllTimers());
    expect(spy).toHaveBeenCalledWith({
      form: expect.any(HTMLFormElement) as HTMLFormElement,
      names: undefined,
      prevValues: { foo: 'bar' },
      values: { foo: 'baz' },
    });
  });

  it('should call the callback when the form is submitted', () => {
    const spy = jest.fn();
    renderHook(() => useSubscribe(spy), {
      wrapper: ({ children }) => (
        <Form>
          <input data-testid="foo" defaultValue="bar" name="foo" />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    spy.mockClear();
    fireEvent.submit(screen.getByTestId('rsf-form'));
    act(() => jest.runAllTimers());
    expect(spy).toHaveBeenCalledWith({
      form: expect.any(HTMLFormElement) as HTMLFormElement,
      names: undefined,
      prevValues: { foo: 'bar' },
      values: { foo: 'bar' },
    });
  });
  it('should not register the same callback twice', () => {
    const spy = jest.fn();
    function useTwice(): void {
      useSubscribe(spy);
      useSubscribe(spy);
    }
    renderHook(() => useTwice(), {
      wrapper: ({ children }) => (
        <Form>
          <input defaultValue="bar" name="foo" />
          {children}
        </Form>
      ),
    });
    act(() => jest.runAllTimers());
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
