import { fireEvent, render, screen } from '@testing-library/react';

import { Form } from '../Form/Form';

import { Reset } from './Reset';

describe('Reset component', () => {
  it('should render the component', () => {
    render(
      <Form>
        <Reset />
      </Form>,
    );
    expect(screen.getByTestId('rsf-reset')).toBeVisible();
  });

  it('should reset the form', () => {
    render(
      <Form>
        <input data-testid="rsf-input" name="foo" />
        <Reset />
      </Form>,
    );
    fireEvent.change(screen.getByTestId('rsf-input'), {
      target: { value: 'foo' },
    });
    // @ts-expect-error element type
    expect(screen.getByTestId('rsf-input').value).toEqual('foo');
    fireEvent.click(screen.getByTestId('rsf-reset'));
    // @ts-expect-error element type
    expect(screen.getByTestId('rsf-input').value).toEqual('');
  });
});
