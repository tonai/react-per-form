# Types

## `IError`

```ts
interface IError {
  all: Record<string, string>;
  global: Record<string, IValidatorError>;
  main?: IMainError;
  manual: Record<string, string | null>;
  native: Record<string, string>;
  validator: Record<string, IValidatorError>;
}
```

## `IFormContext`

```ts
interface IFormContext {
  errors: IError;
  form: RefObject<HTMLFormElement>;
  messages?: IMessages;
  mode: IFormMode;
  onChange: IOnChangeHandler;
  onError: IOnErrorHandler;
  onReset: IOnResetHandler;
  onSubmit: IOnSubmitHandler;
  register: IRegister;
  reset: IFormReset;
  revalidateMode: IFormRevalidateMode;
  subscribe: ISubscribe;
  unregister: IUnregister;
  useNativeValidation: boolean;
  validate: IFormValidate;
  watch: IWatch;
}
```

## `IFormReset`

```ts
type IFormReset = (resetValues?: Record<string, unknown> | null) => void;
```

## `IMainError`

```ts
interface IMainError {
  error: string;
  global: boolean;
  id: string;
  names: string[];
}
```

## `IOnChangeHandler`

```ts
type IOnChangeHandler = <V, T extends unknown[] = unknown[]>(params?: {
  callback?: ((value: V, ...args: T) => void) | null;
  getError?: ((value: V, ...args: T) => string | null) | null;
  name?: string;
  transformer?: ((value: unknown) => V) | null;
}) => (value: unknown, ...args: T) => void;
```

## `IOnErrorHandler`

```ts
type IOnErrorHandler = (name: string) => (error: string | null) => void;
```

## `IOnResetHandler`

```ts
type IOnResetHandler = (
  callback?: IResetHandler,
) => (event: FormEvent<HTMLFormElement>) => void;
```

## `IOnSubmitHandler`

```ts
type IOnSubmitHandler = (
  validCallback?: ISubmitHandler,
  invalidCallback?: ISubmitErrorHandler,
) => (event: FormEvent<HTMLFormElement>) => void;
```

## `IResetHandler`

```ts
type IResetHandler = (
  event: FormEvent<HTMLFormElement>,
  values: Record<string, unknown>,
) => Record<string, unknown> | null | void;
```

## `ISubmitHandler`

```ts
type ISubmitHandler = (
  event: FormEvent<HTMLFormElement>,
  values: Record<string, unknown>,
  reset: IFormReset,
) => void;
```

## `ISubmitErrorHandler`

```ts
type ISubmitErrorHandler = (
  event: FormEvent<HTMLFormElement>,
  error: IError,
  reset: IFormReset,
) => void;
```

## `ISubscribe`

```ts
type ISubscribe = (
  subscriber: ISubscriber,
  names?: string[] | string,
) => IUnSubscribe;
```

## `ISubscriber`

```ts
type ISubscriber = (params: ISubscriberParams) => void;
```

## `ISubscriberParams`

```ts
interface ISubscriberParams {
  form: HTMLFormElement | null;
  names?: string[];
  prevValues: IFormValues;
  states: IFormStates;
  values: IFormValues;
}
```

## `IValidator`

```ts
type IValidator = (values: Record<string, unknown>, names: string[]) => string;
```

## `IValidatorError`

```ts
interface IValidatorError {
  error: string;
  global: boolean;
  names: string[];
}
```

## `IValidatorObject`

```ts
interface IValidatorObject {
  names: string[];
  validator: IValidator;
}
```

## `IWatch`

```ts
type IWatch = <V extends Record<string, unknown>>(
  callback: (values: V) => void,
  names?: string[] | string,
) => IUnSubscribe;
```
