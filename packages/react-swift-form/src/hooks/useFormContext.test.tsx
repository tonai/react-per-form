import { renderHook, screen, waitFor } from '@testing-library/react';

import { Form } from '../components/Form/Form';

import { useFormContext } from './useFormContext';

describe('useFormContext hook', () => {
  it('should return the context value', async () => {
    // Init
    const { result } = renderHook(() => useFormContext(), {
      wrapper: ({ children }) => <Form mode="blur">{children}</Form>,
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(result.current.mode).toEqual('blur');
  });
});
