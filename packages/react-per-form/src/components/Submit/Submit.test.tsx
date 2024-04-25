import { render, screen, waitFor } from '@testing-library/react';

import { Form } from '../Form/Form';

import { Submit } from './Submit';

describe('Submit component', () => {
  it('should be enabled (disableOnError off)', async () => {
    // Init
    render(
      <Form>
        <Submit />
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    expect(screen.getByTestId('rpf-submit')).not.toBeDisabled();
  });

  it('should be enabled (empty form)', async () => {
    // Init
    render(
      <Form>
        <Submit disableOnError />
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    expect(screen.getByTestId('rpf-submit')).not.toBeDisabled();
  });

  it('should be enabled (valid form)', async () => {
    // Init
    render(
      <Form>
        <input name="foo" />
        <Submit disableOnError />
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    expect(screen.getByTestId('rpf-submit')).not.toBeDisabled();
  });

  it('should be disabled (invalid form)', async () => {
    // Init
    render(
      <Form>
        <input name="foo" required />
        <Submit disableOnError />
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    expect(screen.getByTestId('rpf-submit')).toBeDisabled();
  });
});
