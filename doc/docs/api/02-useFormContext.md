# `useFormContext`

`useFormContext` is for retrieving the form context when the `<Form>` or the `<FormProvider>` components are set.

## Parameters

There is no parameters for `useFormContext`.

## Returns

`useFormContext` return an object with the following shape (it is basically the same as the return from `useForm` without `formProps`):

| Property            | Type                                      | Description                                                                                                                                                                        |
| ------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| errors              | `IError`                                  | Form errors (see [errors guide](/docs/guides/errors) for more information)                                                                                                         |
| form                | `RefObject<HTMLFormElement>`              | Form ref                                                                                                                                                                           |
| messages            | `Record<string, string>`                  | Given custom messages                                                                                                                                                              |
| mode                | `'all' \| 'blur' \| 'change' \| 'submit'` | Chosen Validation strategy                                                                                                                                                         |
| onChange            | `IOnChangeHandler`                        | Change handler (see [type casting guide](/docs/guides/type-casting-and-default-values) and [controlled components guide](/docs/guides/controlled-components) for more information) |
| onError             | `IOnErrorHandler`                         | Manual error handler (see [controlled components guide](/docs/guides/controlled-components#managing-manual-errors) for more information)                                           |
| onReset             | `IOnResetHandler`                         | Reset handler (see [reset guide](/docs/guides/submit-and-reset#with-the-onreset-handler) for more information)                                                                     |
| onSubmit            | `IOnSubmitHandler`                        | Submit handler (see [submit guide](/docs/guides/submit-and-reset#using-the-onsubmit-handler) for more information)                                                                 |
| register            | `IRegister`                               | Internal usage                                                                                                                                                                     |
| reset               | `IFormReset`                              | Manual reset function                                                                                                                                                              |
| revalidateMode      | `'blur' \| 'change' \| 'submit'`          | Chosen re-validation strategy                                                                                                                                                      |
| subscribe           | `ISubscribe`                              | Internal usage                                                                                                                                                                     |
| unregister          | `IUnregister`                             | Internal usage                                                                                                                                                                     |
| useNativeValidation | `boolean`                                 | Choice for native validation or not                                                                                                                                                |
| validate            | `IFormValidate`                           | Manual validate function                                                                                                                                                           |
| watch               | `IWatch`                                  | Manual watch function (see [watch guide](/docs/guides/watch) for more information)                                                                                                 |

See [here](/docs/api/types) for the types.

## Usage

import SimpleHookUseFormContext from '@site/src/demo/SimpleHookUseFormContext';
import SimpleHookUseFormContextSource from '!!raw-loader!@site/src/demo/SimpleHookUseFormContext';
import SimpleComponentUseFormContext from '@site/src/demo/SimpleComponentUseFormContext';
import SimpleComponentUseFormContextSource from '!!raw-loader!@site/src/demo/SimpleComponentUseFormContext';

<DemoTabs Component={SimpleComponentUseFormContext} Hook={SimpleHookUseFormContext} componentCode={SimpleComponentUseFormContextSource} componentMetastring="{6,22,25}" hookCode={SimpleHookUseFormContextSource} hookMetastring="{7,28,33}" withModes withRevalidateModes />
