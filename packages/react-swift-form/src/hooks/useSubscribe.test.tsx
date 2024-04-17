import { fireEvent, renderHook, screen, waitFor } from '@testing-library/react';

import { Form } from '../components/Form/Form';

import { useSubscribe } from './useSubscribe';

describe('useSubscribe hook', () => {
  it('should call the callback when the form is initialized', async () => {
    const spy = jest.fn();
    // Init
    renderHook(() => useSubscribe(spy), {
      wrapper: ({ children }) => (
        <Form>
          <input defaultValue="bar" name="foo" />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(spy).toHaveBeenCalledWith({
      form: expect.any(HTMLFormElement) as HTMLFormElement,
      names: undefined,
      prevValues: {},
      states: { valid: true },
      values: { foo: 'bar' },
    });
  });

  // it('should call the callback with filtered values (string)', async () => {
  //   const spy = jest.fn();
  //   // Init
  //   renderHook(() => useSubscribe(spy, 'foo'), {
  //     wrapper: ({ children }) => (
  //       <Form>
  //         <input defaultValue="foo" name="foo" />
  //         <input defaultValue="bar" name="bar" />
  //         {children}
  //       </Form>
  //     ),
  //   });
  //   await waitFor(() =>
  //     expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
  //   );
  //   expect(spy).toHaveBeenCalledWith({
  //     form: expect.any(HTMLFormElement) as HTMLFormElement,
  //     names: ['foo'],
  //     prevValues: {},
  //     states: { valid: true },
  //     values: { foo: 'foo' },
  //   });
  // });

  // it('should call the callback with filtered values (array)', async () => {
  //   const spy = jest.fn();
  //   // Init
  //   renderHook(() => useSubscribe(spy, ['foo']), {
  //     wrapper: ({ children }) => (
  //       <Form>
  //         <input defaultValue="foo" name="foo" />
  //         <input defaultValue="bar" name="bar" />
  //         {children}
  //       </Form>
  //     ),
  //   });
  //   await waitFor(() =>
  //     expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
  //   );
  //   expect(spy).toHaveBeenCalledWith({
  //     form: expect.any(HTMLFormElement) as HTMLFormElement,
  //     names: ['foo'],
  //     prevValues: {},
  //     states: { valid: true },
  //     values: { foo: 'foo' },
  //   });
  // });

  it('should call the callback when the form is changed', async () => {
    const spy = jest.fn();
    // Init
    renderHook(() => useSubscribe(spy), {
      wrapper: ({ children }) => (
        <Form>
          <input data-testid="foo" defaultValue="bar" name="foo" />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    spy.mockClear();
    // Change
    fireEvent.change(screen.getByTestId('foo'), { target: { value: 'baz' } });
    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith({
        form: expect.any(HTMLFormElement) as HTMLFormElement,
        names: undefined,
        prevValues: { foo: 'bar' },
        states: { valid: true },
        values: { foo: 'baz' },
      }),
    );
  });

  it('should call the callback when the form is submitted', async () => {
    const spy = jest.fn();
    // Init
    renderHook(() => useSubscribe(spy), {
      wrapper: ({ children }) => (
        <Form>
          <input data-testid="foo" defaultValue="bar" name="foo" />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    spy.mockClear();
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith({
        form: expect.any(HTMLFormElement) as HTMLFormElement,
        names: undefined,
        prevValues: { foo: 'bar' },
        states: { valid: true },
        values: { foo: 'bar' },
      }),
    );
  });

  it('should not register the same callback twice', async () => {
    const spy = jest.fn();
    function useTwice(): void {
      useSubscribe(spy);
      useSubscribe(spy);
    }
    // Init
    renderHook(() => useTwice(), {
      wrapper: ({ children }) => (
        <Form>
          <input defaultValue="bar" name="foo" />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
