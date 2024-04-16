import { fireEvent, renderHook, screen, waitFor } from '@testing-library/react';

import { Form } from '../components/Form/Form';

import { useFormValid } from './useFormValid';

jest.useFakeTimers();

describe('useFormValid hook', () => {
  it('should return true when the form is valid', async () => {
    // Init
    const { result } = renderHook(() => useFormValid(), {
      wrapper: ({ children }) => (
        <Form>
          <input />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(result.current).toEqual(true);
  });

  it('should return false when the form is invalid', async () => {
    // Init
    const { result } = renderHook(() => useFormValid(), {
      wrapper: ({ children }) => (
        <Form>
          <input required />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(result.current).toEqual(false);
  });

  it('should then return true is the form is updated and valid', async () => {
    // Init
    const { result } = renderHook(() => useFormValid(), {
      wrapper: ({ children }) => (
        <Form>
          <input data-testid="rsf-input" name="foo" required />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(result.current).toEqual(false);
    // Change
    fireEvent.change(screen.getByTestId('rsf-input'), {
      target: { value: 'foo' },
    });
    await waitFor(() => expect(result.current).toEqual(true));
  });
});
