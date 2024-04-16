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
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    expect(screen.getByTestId('rsf-reset')).toBeVisible();
  });

  it('should reset the form', async () => {
    // Init
    render(
      <Form>
        <input data-testid="rsf-input" name="foo" />
        <Reset />
      </Form>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('rsf-form')?.dataset.rsf).toEqual('init'),
    );
    // Change
    fireEvent.change(screen.getByTestId('rsf-input'), {
      target: { value: 'foo' },
    });
    // @ts-expect-error element type
    expect(screen.getByTestId('rsf-input').value).toEqual('foo');
    // Reset
    fireEvent.click(screen.getByTestId('rsf-reset'));
    // @ts-expect-error element type
    expect(screen.getByTestId('rsf-input').value).toEqual('');
  });
});
