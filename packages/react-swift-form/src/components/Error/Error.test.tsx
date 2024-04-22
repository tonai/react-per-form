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
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(screen.queryByTestId('rsf-error')).toBeNull();
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
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(screen.queryByTestId('rsf-error')).toBeNull();
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
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(screen.queryByTestId('rsf-error')).toBeNull();
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
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() => {
      expect(screen.getByTestId('rsf-error')).toBeVisible();
    });
    expect(screen.getByTestId('rsf-error')).toHaveTextContent(
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
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() => {
      expect(screen.getByTestId('rsf-error')).toBeVisible();
    });
    expect(screen.getByTestId('rsf-error')).toHaveTextContent(
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
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() => {
      expect(screen.getByTestId('rsf-error')).toBeVisible();
    });
    expect(screen.getByTestId('rsf-error')).toHaveTextContent(
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
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() => {
      expect(screen.getByTestId('rsf-error')).toBeVisible();
    });
    expect(screen.getByTestId('rsf-error')).toHaveTextContent('error');
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
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() => {
      expect(screen.getByTestId('rsf-error')).toBeVisible();
    });
    expect(screen.getByTestId('rsf-error')).toHaveTextContent('error');
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
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Submit
    fireEvent.submit(screen.getByTestId('rsf-form'));
    await waitFor(() => {
      expect(screen.getByTestId('rsf-error')).toBeVisible();
    });
    expect(screen.getByTestId('rsf-error')).toHaveTextContent('error');
  });
});
