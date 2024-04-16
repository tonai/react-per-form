import { fireEvent, renderHook, screen, waitFor } from '@testing-library/react';

import { Form } from '../components/Form/Form';

import { useFormErrors } from './useFormErrors';

describe('useFormErrors hook', () => {
  it('should not return any error when the form submitted and valid', async () => {
    // Init
    const { result } = renderHook(() => useFormErrors(), {
      wrapper: ({ children }) => (
        <Form useNativeValidation={false}>
          <input name="foo" />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() =>
      expect(result.current).toEqual({
        all: { foo: '' },
        global: {},
        manual: {},
        native: { foo: '' },
        validator: {},
      }),
    );
  });

  it('should return the errors when the form submitted and invalid', async () => {
    // Init
    const { result } = renderHook(() => useFormErrors(), {
      wrapper: ({ children }) => (
        <Form useNativeValidation={false}>
          <input name="foo" required />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() =>
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
      }),
    );
  });
});
