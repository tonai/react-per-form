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
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith({
      changedFields: [],
      dirtyFields: [],
      isChanged: false,
      isDirty: false,
      isPristine: true,
      isReady: false,
      isSubmitted: false,
      isSubmitting: false,
      isTouched: false,
      isValid: true,
      isValidating: true,
      submitCount: 0,
      touchedFields: [],
    });
    expect(spy).toHaveBeenCalledWith({
      changedFields: [],
      dirtyFields: [],
      isChanged: false,
      isDirty: false,
      isPristine: true,
      isReady: false,
      isSubmitted: false,
      isSubmitting: false,
      isTouched: false,
      isValid: true,
      isValidating: false,
      submitCount: 0,
      touchedFields: [],
    });
    expect(spy).toHaveBeenCalledWith({
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
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(2));
    expect(spy).toHaveBeenCalledWith({
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
      isValidating: true,
      submitCount: 0,
      touchedFields: [],
    });
    expect(spy).toHaveBeenCalledWith({
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
    });
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
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(3));
    expect(spy).toHaveBeenCalledWith({
      changedFields: [],
      dirtyFields: [],
      isChanged: false,
      isDirty: false,
      isPristine: true,
      isReady: true,
      isSubmitted: false,
      isSubmitting: true,
      isTouched: false,
      isValid: true,
      isValidating: true,
      submitCount: 0,
      touchedFields: [],
    });
    expect(spy).toHaveBeenCalledWith({
      changedFields: [],
      dirtyFields: [],
      isChanged: false,
      isDirty: false,
      isPristine: true,
      isReady: true,
      isSubmitted: false,
      isSubmitting: true,
      isTouched: false,
      isValid: true,
      isValidating: false,
      submitCount: 0,
      touchedFields: [],
    });
    expect(spy).toHaveBeenCalledWith({
      changedFields: [],
      dirtyFields: [],
      isChanged: false,
      isDirty: false,
      isPristine: true,
      isReady: true,
      isSubmitted: true,
      isSubmitting: false,
      isTouched: false,
      isValid: true,
      isValidating: false,
      submitCount: 1,
      touchedFields: [],
    });
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
    expect(spy).toHaveBeenCalledTimes(3);
  });
});
