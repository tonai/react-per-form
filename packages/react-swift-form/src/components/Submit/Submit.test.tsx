import { act, render, screen } from '@testing-library/react';

import { Form } from '../Form/Form';

import { Submit } from './Submit';

jest.useFakeTimers();

describe('Submit component', () => {
  it('should be enabled (disableOnError off)', () => {
    render(
      <Form>
        <Submit />
      </Form>,
    );
    act(() => jest.runAllTimers());
    expect(screen.getByTestId('rsf-submit')).not.toBeDisabled();
  });

  it('should be enabled (empty form)', () => {
    render(
      <Form>
        <Submit disableOnError />
      </Form>,
    );
    act(() => jest.runAllTimers());
    expect(screen.getByTestId('rsf-submit')).not.toBeDisabled();
  });

  it('should be enabled (valid form)', () => {
    render(
      <Form>
        <input name="foo" />
        <Submit disableOnError />
      </Form>,
    );
    act(() => jest.runAllTimers());
    expect(screen.getByTestId('rsf-submit')).not.toBeDisabled();
  });

  it('should be disabled (invalid form)', () => {
    render(
      <Form>
        <input name="foo" required />
        <Submit disableOnError />
      </Form>,
    );
    act(() => jest.runAllTimers());
    expect(screen.getByTestId('rsf-submit')).toBeDisabled();
  });
});
