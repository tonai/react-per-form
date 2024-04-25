import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Form } from '../Form/Form';

import { Reset } from './Reset';

describe('Reset component', () => {
  it('should render the component', async () => {
    // Init
    render(
      <Form>
        <Reset />
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    expect(screen.getByTestId('rpf-reset')).toBeVisible();
  });

  it('should reset the form', async () => {
    // Init
    render(
      <Form>
        <input data-testid="rpf-input" name="foo" />
        <Reset />
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rpf-form')?.dataset.rpf).toEqual('init'),
    );
    // Change
    fireEvent.change(screen.getByTestId('rpf-input'), {
      target: { value: 'foo' },
    });
    // @ts-expect-error element type
    expect(screen.getByTestId('rpf-input').value).toEqual('foo');
    // Reset
    fireEvent.click(screen.getByTestId('rpf-reset'));
    // @ts-expect-error element type
    expect(screen.getByTestId('rpf-input').value).toEqual('');
  });
});
