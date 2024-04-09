# Types

## `IError`

```ts
{
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
{
  errors: IError;
  form: RefObject<HTMLFormElement>;
  messages?: IMessages;
  mode: IFormMode;
  onChange: IOnChangeHandler;
  onError: IOnErrorHandler;
  onReset: IOnResetHandler;
  onSubmit: IOnSubmitHandler;
  removeValidators: IRemoveValidators;
  reset: IFormReset;
  revalidateMode: IFormRevalidateMode;
  setValidators: ISetValidators;
  subscribe: ISubscribe;
  useNativeValidation: boolean;
  validate: IFormValidate;
  watch: IWatch;
}
```

## `IFormReset`

```ts
(resetValues?: Record<string, unknown> | null) => void
```

## `IMainError`

```ts
{
  error: string;
  global: boolean;
  id: string;
  names: string[];
}
```

## `IOnChangeHandler`

```ts
<V, T extends unknown[] = unknown[]>(params?: {
  callback?: ((value: V, ...args: T) => void) | null;
  getError?: ((value: V, ...args: T) => string | null) | null;
  name?: string;
  transformer?: ((value: unknown) => V) | null;
}) => (value: unknown, ...args: T) => void;
```

## `IOnErrorHandler`

```ts
(name: string) => (error: string | null) => void
```

## `IOnResetHandler`

```ts
(callback?: IResetHandler) => (event: FormEvent<HTMLFormElement>) => void
```

## `IOnSubmitHandler`

```ts
(
  validCallback?: ISubmitHandler,
  invalidCallback?: ISubmitErrorHandler
) => (event: FormEvent<HTMLFormElement>) => void
```

## `IResetHandler`

```ts
(
  event: FormEvent<HTMLFormElement>,
  values: Record<string, unknown>,
) => Record<string, unknown> | null | void
```

## `ISubmitHandler`

```ts
(
  event: FormEvent<HTMLFormElement>,
  values: Record<string, unknown>,
  reset: IFormReset
) => void
```

## `ISubmitErrorHandler`

```ts
(
  event: FormEvent<HTMLFormElement>,
  error: IError, reset: IFormReset
) => void
```

## `IValidator`

```ts
(values: Record<string, unknown>, names: string[]) => string;
```

## `IValidatorError`

```ts
{
  error: string;
  global: boolean;
  names: string[];
}
```

## `IValidatorObject`

```ts
{
  names: string[];
  validator: IValidator;
}
```

## `IWatch`

```ts
<V extends Record<string, unknown>>(
  callback: (values: V) => void,
  names?: string[] | string,
) => IUnSubscribe;
```
