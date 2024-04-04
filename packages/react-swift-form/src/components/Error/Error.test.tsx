import { fireEvent, render, screen } from '@testing-library/react';

import { Form } from '../Form/Form';

import { Error } from './Error';

describe('Reset component', () => {
  it('should not render the component (native validation)', () => {
    render(
      <Form>
        <input name="foo" />
        <Error />
      </Form>,
    );
    expect(screen.queryByTestId('rfv-error')).toBeNull();
  });

  it('should not render the component (no error)', () => {
    render(
      <Form useNativeValidation={false}>
        <input name="foo" />
        <Error />
      </Form>,
    );
    expect(screen.queryByTestId('rfv-error')).toBeNull();
  });

  it('should not render the component (not submitted)', () => {
    render(
      <Form useNativeValidation={false}>
        <input name="foo" required />
        <Error />
      </Form>,
    );
    expect(screen.queryByTestId('rfv-error')).toBeNull();
  });

  it('should display the native error', () => {
    render(
      <Form useNativeValidation={false}>
        <input name="foo" required />
        <Error />
      </Form>,
    );
    fireEvent.submit(screen.getByTestId('rfv-form'));
    expect(screen.getByTestId('rfv-error')).toBeVisible();
    expect(screen.getByTestId('rfv-error')).toHaveTextContent(
      'Constraints not satisfied',
    );
  });

  it('should display the native error (errorPath=native)', () => {
    render(
      <Form useNativeValidation={false}>
        <input name="foo" required />
        <Error errorPath="native" />
      </Form>,
    );
    fireEvent.submit(screen.getByTestId('rfv-form'));
    expect(screen.getByTestId('rfv-error')).toBeVisible();
    expect(screen.getByTestId('rfv-error')).toHaveTextContent(
      'Constraints not satisfied',
    );
  });

  it('should display the native error (errorPath=native.foo)', () => {
    render(
      <Form useNativeValidation={false}>
        <input name="foo" required />
        <Error errorPath="native.foo" />
      </Form>,
    );
    fireEvent.submit(screen.getByTestId('rfv-form'));
    expect(screen.getByTestId('rfv-error')).toBeVisible();
    expect(screen.getByTestId('rfv-error')).toHaveTextContent(
      'Constraints not satisfied',
    );
  });

  it('should display the validator error (errorPath=validator)', () => {
    render(
      <Form useNativeValidation={false} validators={{ foo: () => 'error' }}>
        <input name="foo" />
        <Error errorPath="validator" />
      </Form>,
    );
    fireEvent.submit(screen.getByTestId('rfv-form'));
    expect(screen.getByTestId('rfv-error')).toBeVisible();
    expect(screen.getByTestId('rfv-error')).toHaveTextContent('error');
  });

  it('should display the validator error (global)', () => {
    render(
      <Form useNativeValidation={false} validators={{ foo: () => 'error' }}>
        <input name="foo" />
        <Error global />
      </Form>,
    );
    fireEvent.submit(screen.getByTestId('rfv-form'));
    expect(screen.getByTestId('rfv-error')).toBeVisible();
    expect(screen.getByTestId('rfv-error')).toHaveTextContent('error');
  });

  it('should display the validator error (errorPath=validator and global)', () => {
    render(
      <Form useNativeValidation={false} validators={{ foo: () => 'error' }}>
        <input name="foo" />
        <Error errorPath="validator" global />
      </Form>,
    );
    fireEvent.submit(screen.getByTestId('rfv-form'));
    expect(screen.getByTestId('rfv-error')).toBeVisible();
    expect(screen.getByTestId('rfv-error')).toHaveTextContent('error');
  });
});
