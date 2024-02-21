import type { IMainError, IValidatorError } from '../../types';
import type {
  ComponentPropsWithoutRef,
  JSXElementConstructor,
  ReactElement,
} from 'react';

import { useContext } from 'react';

import { formContext } from '../../contexts';
import { getProperty, isMainError, isValidatorError } from '../../helpers';

type IElementType =
  | JSXElementConstructor<unknown>
  | keyof JSX.IntrinsicElements;

type IPropsOf<C extends IElementType> = JSX.LibraryManagedAttributes<
  C,
  ComponentPropsWithoutRef<C>
>;

type IErrorProps<C extends IElementType = 'div'> = IPropsOf<C> & {
  Component?: C;
  errorPath?: string;
  global?: boolean;
};

export function Error(props: IErrorProps): ReactElement | null {
  const {
    Component = 'div',
    errorPath = 'main',
    global,
    ...otherProps
  } = props;
  const { errors } = useContext(formContext);
  const error = getProperty<
    | IMainError
    | IValidatorError
    | Record<string, IValidatorError>
    | Record<string, string>
    | string
  >(errors, errorPath);

  if (!error) {
    return null;
  }

  let errorString: string | undefined;
  if (typeof error === 'string' && !global) {
    errorString = error;
  } else if (
    (isMainError(error) || isValidatorError(error)) &&
    (!global || error.global)
  ) {
    errorString = error.error;
  } else {
    const errorValue = Object.values(error)[0] as IValidatorError | string;
    if (typeof errorValue === 'string' && !global) {
      errorString = errorValue;
    } else if (isValidatorError(errorValue) && (!global || errorValue.global)) {
      errorString = errorValue.error;
    }
  }

  if (!errorString) {
    return null;
  }

  return (
    <Component data-testid="rfv-error" {...otherProps}>
      {errorString}
    </Component>
  );
}
