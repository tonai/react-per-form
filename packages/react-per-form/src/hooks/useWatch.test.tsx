import { fireEvent, renderHook, screen, waitFor } from '@testing-library/react';

import { Form } from '../components/Form/Form';

import { useWatch } from './useWatch';

describe('useWatch hook', () => {
  it('should return the form initial values', async () => {
    // Init
    const { result } = renderHook(() => useWatch(), {
      wrapper: ({ children }) => (
        <Form>
          <input defaultValue="bar" name="foo" />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    expect(result.current).toEqual({ foo: 'bar' });
  });

  it('should return the form filtered values', async () => {
    // Init
    const { result } = renderHook(() => useWatch(['foo']), {
      wrapper: ({ children }) => (
        <Form>
          <input defaultValue="foo" name="foo" />
          <input defaultValue="bar" name="bar" />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    expect(result.current).toEqual({ foo: 'foo' });
  });

  it('should return the form changed values', async () => {
    // Init
    const { result } = renderHook(() => useWatch(['foo']), {
      wrapper: ({ children }) => (
        <Form>
          <input data-testid="foo" defaultValue="bar" name="foo" />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    // Change
    fireEvent.change(screen.getByTestId('foo'), { target: { value: 'baz' } });
    await waitFor(() => expect(result.current).toEqual({ foo: 'baz' }));
  });
});
