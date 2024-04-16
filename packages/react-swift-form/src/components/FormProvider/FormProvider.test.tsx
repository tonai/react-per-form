/* eslint-disable react/no-multi-comp */
import type { ReactElement, ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import { useContext } from 'react';

import { formContext } from '../../contexts';
import { useForm } from '../../hooks';

import { FormProvider } from './FormProvider';

function Component({ children }: { children: ReactNode }): ReactElement {
  const { formProps, ...context } = useForm({ mode: 'blur' });
  return (
    <FormProvider {...context}>
      <form {...formProps}>{children}</form>
    </FormProvider>
  );
}

function Input(): ReactElement {
  const { mode } = useContext(formContext);
  return <div data-testid="mode">{mode}</div>;
}

describe('FormProvider component', () => {
  it('should render the component and set the context', () => {
    // Init
    render(
      <Component>
        <Input />
      </Component>,
    );
    expect(screen.getByTestId('mode')).toHaveTextContent('blur');
  });
});
