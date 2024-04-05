import { renderHook } from '@testing-library/react';

import { Form } from '../components/Form/Form';

import { useFormContext } from './useFormContext';

jest.useFakeTimers();

describe('useFormContext hook', () => {
  it('should return the context value', () => {
    const { result } = renderHook(() => useFormContext(), {
      wrapper: ({ children }) => <Form mode="blur">{children}</Form>,
    });
    expect(result.current.mode).toEqual('blur');
  });
});
