# `<FormProvider>`

The `<FormProvider>` component is used to set up the form context.

## Props

`<Form>` takes the following props:

| Property            | Type                                      | Default | Description                                                                                                                                                                        |
| ------------------- | ----------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| children            | `ReactNode`                               |         | The `<FormProvider>` children                                                                                                                                                      |
| errors              | `IError`                                  |         | Form errors (see [errors guide](/docs/guides/errors) for more information)                                                                                                         |
| form                | `RefObject<HTMLFormElement>`              |         | Form ref                                                                                                                                                                           |
| formProps           | `IFormProps`                              |         | Form props to add on your form component                                                                                                                                           |
| messages            | `Record<string, string>`                  |         | Given custom messages                                                                                                                                                              |
| mode                | `'all' \| 'blur' \| 'change' \| 'submit'` |         | Chosen Validation strategy                                                                                                                                                         |
| onChange            | `IOnChangeHandler`                        |         | Change handler (see [type casting guide](/docs/guides/type-casting-and-default-values) and [controlled components guide](/docs/guides/controlled-components) for more information) |
| onError             | `IOnErrorHandler`                         |         | Manual error handler (see [controlled components guide](/docs/guides/controlled-components#managing-manual-errors) for more information)                                           |
| onReset             | `IOnResetHandler`                         |         | Reset handler (see [reset guide](/docs/guides/submit-and-reset#with-the-onreset-handler) for more information)                                                                     |
| onSubmit            | `IOnSubmitHandler`                        |         | Submit handler (see [submit guide](/docs/guides/submit-and-reset#using-the-onsubmit-handler) for more information)                                                                 |
| register            | `IRegister`                               |         | Internal usage                                                                                                                                                                     |
| reset               | `IFormReset`                              |         | Manual reset function                                                                                                                                                              |
| revalidateMode      | `'blur' \| 'change' \| 'submit'`          |         | Chosen re-validation strategy                                                                                                                                                      |
| subscribe           | `ISubscribe`                              |         | Internal usage                                                                                                                                                                     |
| unregister          | `IUnregister`                             |         | Internal usage                                                                                                                                                                     |
| useNativeValidation | `boolean`                                 |         | Choice for native validation or not                                                                                                                                                |
| validate            | `IFormValidate`                           |         | Manual validate function                                                                                                                                                           |
| watch               | `IWatch`                                  |         | Manual watch function (see [watch guide](/docs/guides/watch) for more information)                                                                                                 |

See [here](/docs/api/types) for the types.

## Usage

To set up the `<FormProvider>` destructure the context value from the `useForm` hook like this:

import SimpleHookUseFormErrors from '@site/src/demo/SimpleHookUseFormErrors';
import SimpleHookUseFormErrorsSource from '!!raw-loader!@site/src/demo/SimpleHookUseFormErrors';

<Demo Component={SimpleHookUseFormErrors} code={SimpleHookUseFormErrorsSource} metastring="{22,28,33}" withModes withRevalidateModes withUseNativeValidation/>
