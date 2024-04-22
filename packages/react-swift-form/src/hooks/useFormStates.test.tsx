import { fireEvent, renderHook, screen, waitFor } from '@testing-library/react';

import { Form } from '../components/Form/Form';

import { useFormStates } from './useFormStates';

jest.useFakeTimers();

describe('useFormStates hook', () => {
  it('should return the states on init (form is valid)', async () => {
    // Init
    const { result } = renderHook(() => useFormStates(), {
      wrapper: ({ children }) => (
        <Form>
          <input name="foo" />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(result.current).toEqual({
      changedFields: [],
      dirtyFields: [],
      isChanged: false,
      isDirty: false,
      isPristine: true,
      isReady: true,
      isSubmitted: false,
      isSubmitting: false,
      isTouched: false,
      isValid: true,
      isValidating: false,
      submitCount: 0,
      touchedFields: [],
    });
  });

  it('should return the states on init (form is invalid)', async () => {
    // Init
    const { result } = renderHook(() => useFormStates(), {
      wrapper: ({ children }) => (
        <Form>
          <input name="foo" required />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(result.current).toEqual({
      changedFields: [],
      dirtyFields: [],
      isChanged: false,
      isDirty: false,
      isPristine: true,
      isReady: true,
      isSubmitted: false,
      isSubmitting: false,
      isTouched: false,
      isValid: false,
      isValidating: false,
      submitCount: 0,
      touchedFields: [],
    });
  });

  it('should return the states on change', async () => {
    // Init
    const { result } = renderHook(() => useFormStates(), {
      wrapper: ({ children }) => (
        <Form>
          <input data-testid="foo" name="foo" required />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Change
    fireEvent.change(screen.getByTestId('foo'), {
      target: { value: 'foo' },
    });
    await waitFor(() =>
      expect(result.current).toEqual({
        changedFields: ['foo'],
        dirtyFields: ['foo'],
        isChanged: true,
        isDirty: true,
        isPristine: false,
        isReady: true,
        isSubmitted: false,
        isSubmitting: false,
        isTouched: false,
        isValid: true,
        isValidating: false,
        submitCount: 0,
        touchedFields: [],
      }),
    );
  });

  it('should return the states on blur', async () => {
    // Init
    const { result } = renderHook(() => useFormStates(), {
      wrapper: ({ children }) => (
        <Form>
          <input data-testid="foo" name="foo" />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Change
    fireEvent.blur(screen.getByTestId('foo'));
    await waitFor(() =>
      expect(result.current).toEqual({
        changedFields: [],
        dirtyFields: [],
        isChanged: false,
        isDirty: false,
        isPristine: true,
        isReady: true,
        isSubmitted: false,
        isSubmitting: false,
        isTouched: true,
        isValid: true,
        isValidating: false,
        submitCount: 0,
        touchedFields: ['foo'],
      }),
    );
  });
  it('should return the states on init (form is valid + name filter)', async () => {
    // Init
    const { result } = renderHook(() => useFormStates('foo'), {
      wrapper: ({ children }) => (
        <Form>
          <input name="foo" />
          <input name="bar" />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(result.current).toEqual({
      changedFields: [],
      dirtyFields: [],
      isChanged: false,
      isDirty: false,
      isPristine: true,
      isReady: true,
      isSubmitted: false,
      isSubmitting: false,
      isTouched: false,
      isValid: true,
      isValidating: false,
      submitCount: 0,
      touchedFields: [],
    });
  });

  it('should return the states on init (form is invalid + name filter)', async () => {
    // Init
    const { result } = renderHook(() => useFormStates('foo'), {
      wrapper: ({ children }) => (
        <Form>
          <input name="foo" required />
          <input name="bar" required />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(result.current).toEqual({
      changedFields: [],
      dirtyFields: [],
      isChanged: false,
      isDirty: false,
      isPristine: true,
      isReady: true,
      isSubmitted: false,
      isSubmitting: false,
      isTouched: false,
      isValid: false,
      isValidating: false,
      submitCount: 0,
      touchedFields: [],
    });
  });

  it('should return the states on change (name filter)', async () => {
    // Init
    const { result } = renderHook(() => useFormStates('foo'), {
      wrapper: ({ children }) => (
        <Form>
          <input data-testid="foo" name="foo" required />
          <input data-testid="bar" name="bar" required />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Change
    fireEvent.change(screen.getByTestId('bar'), {
      target: { value: 'bar' },
    });
    // Change
    fireEvent.change(screen.getByTestId('foo'), {
      target: { value: 'foo' },
    });
    await waitFor(() =>
      expect(result.current).toEqual({
        changedFields: ['foo'],
        dirtyFields: ['foo'],
        isChanged: true,
        isDirty: true,
        isPristine: false,
        isReady: true,
        isSubmitted: false,
        isSubmitting: false,
        isTouched: false,
        isValid: true,
        isValidating: false,
        submitCount: 0,
        touchedFields: [],
      }),
    );
  });

  it('should return the states on blur (name filter)', async () => {
    // Init
    const { result } = renderHook(() => useFormStates('foo'), {
      wrapper: ({ children }) => (
        <Form>
          <input data-testid="foo" name="foo" />
          <input data-testid="bar" name="bar" />
          {children}
        </Form>
      ),
    });
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Blur
    fireEvent.blur(screen.getByTestId('bar'));
    // Blur
    fireEvent.blur(screen.getByTestId('foo'));
    await waitFor(() =>
      expect(result.current).toEqual({
        changedFields: [],
        dirtyFields: [],
        isChanged: false,
        isDirty: false,
        isPristine: true,
        isReady: true,
        isSubmitted: false,
        isSubmitting: false,
        isTouched: true,
        isValid: true,
        isValidating: false,
        submitCount: 0,
        touchedFields: ['foo'],
      }),
    );
  });
});
