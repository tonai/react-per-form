import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Form } from '../Form/Form';

import { Error } from './Error';

describe('Error component', () => {
  it('should not render the component (native validation)', async () => {
    // Init
    render(
      <Form>
        <input name="foo" />
        <Error />
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    expect(screen.queryByTestId('rpf-error')).toBeNull();
  });

  it('should not render the component (no error)', async () => {
    // Init
    render(
      <Form useNativeValidation={false}>
        <input name="foo" />
        <Error />
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    expect(screen.queryByTestId('rpf-error')).toBeNull();
  });

  it('should not render the component (not submitted)', async () => {
    // Init
    render(
      <Form useNativeValidation={false}>
        <input name="foo" required />
        <Error />
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    expect(screen.queryByTestId('rpf-error')).toBeNull();
  });

  it('should display the native error', async () => {
    // Init
    render(
      <Form useNativeValidation={false}>
        <input name="foo" required />
        <Error />
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rpf-form'));
    await waitFor(() => {
      expect(screen.getByTestId('rpf-error')).toBeVisible();
    });
    expect(screen.getByTestId('rpf-error')).toHaveTextContent(
      'Constraints not satisfied',
    );
  });

  it('should display the native error (errorPath=native)', async () => {
    // Init
    render(
      <Form useNativeValidation={false}>
        <input name="foo" required />
        <Error errorPath="native" />
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rpf-form'));
    await waitFor(() => {
      expect(screen.getByTestId('rpf-error')).toBeVisible();
    });
    expect(screen.getByTestId('rpf-error')).toHaveTextContent(
      'Constraints not satisfied',
    );
  });

  it('should display the native error (errorPath=native.foo)', async () => {
    // Init
    render(
      <Form useNativeValidation={false}>
        <input name="foo" required />
        <Error errorPath="native.foo" />
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rpf-form'));
    await waitFor(() => {
      expect(screen.getByTestId('rpf-error')).toBeVisible();
    });
    expect(screen.getByTestId('rpf-error')).toHaveTextContent(
      'Constraints not satisfied',
    );
  });

  it('should display the validator error (errorPath=validator)', async () => {
    // Init
    render(
      <Form
        filterLocalErrors={false}
        useNativeValidation={false}
        validators={{ foo: () => 'error' }}
      >
        <input name="foo" />
        <Error errorPath="validator" />
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rpf-form'));
    await waitFor(() => {
      expect(screen.getByTestId('rpf-error')).toBeVisible();
    });
    expect(screen.getByTestId('rpf-error')).toHaveTextContent('error');
  });

  it('should display the validator error (global)', async () => {
    // Init
    render(
      <Form
        filterLocalErrors={false}
        useNativeValidation={false}
        validators={{ foo: () => 'error' }}
      >
        <input name="foo" />
        <Error global />
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rpf-form'));
    await waitFor(() => {
      expect(screen.getByTestId('rpf-error')).toBeVisible();
    });
    expect(screen.getByTestId('rpf-error')).toHaveTextContent('error');
  });

  it('should display the validator error (errorPath=validator and global)', async () => {
    // Init
    render(
      <Form
        filterLocalErrors={false}
        useNativeValidation={false}
        validators={{ foo: () => 'error' }}
      >
        <input name="foo" />
        <Error errorPath="validator" global />
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rpf-form'));
    await waitFor(() => {
      expect(screen.getByTestId('rpf-error')).toBeVisible();
    });
    expect(screen.getByTestId('rpf-error')).toHaveTextContent('error');
  });
});
