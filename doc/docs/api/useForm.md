# `useForm`

`useForm` is the base hook containing all react-per-form logic.

## Parameters

`useForm` take only one parameter that is an object with the following shape:

| Property            | Type                                             | Default    | Description                                                                                                                                                            |
| ------------------- | ------------------------------------------------ | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| defaultValues       | `Record<string, unknown>`                        |            | Form default values (see [default values guide](/docs/guides/type-casting-and-default-values#default-values) for more information)                                     |
| filterLocalErrors   | `boolean`                                        | `true`     | Filter local errors from the global form errors (see [local fields guide](/docs/guides/local-fields) for more information)                                             |
| focusOnError        | `boolean`                                        | `true`     | Focus the first field error or not                                                                                                                                     |
| form                | `HTMLFormElement`                                | `null`     | Form ref                                                                                                                                                               |
| messages            | `Record<string, string>`                         |            | Custom messages (see [messages guide](/docs/guides/messages-and-i18n) for more information)                                                                            |
| mode                | `'all' \| 'blur' \| 'change' \| 'submit'`        | `'submit'` | Validation strategy (see [mode guide](/docs/guides/modes) for more information)                                                                                        |
| onBlurOptOut        | `string[] \| string`                             |            | Opt-out for native `onBlur` event                                                                                                                                      |
| onChangeOptOut      | `string[] \| string`                             |            | Opt-out for native `onChange` event (see [controlled components guide](/docs/guides/controlled-components#validators-and-onchange-event-opt-out) for more information) |
| onReset             | `IResetHandler`                                  |            | Reset callback                                                                                                                                                         |
| onSubmit            | `ISubmitHandler`                                 |            | Submit callback                                                                                                                                                        |
| onSubmitError       | `ISubmitErrorHandler`                            |            | Submit error callback (only when `useNativeValidation=false`)                                                                                                          |
| revalidateMode      | `'blur' \| 'change' \| 'submit'`                 | `'submit'` | Re-validation strategy (see [mode guide](/docs/guides/modes) for more information)                                                                                     |
| transformers        | `Record<string, (value: unknown) => unknown>`    |            | Transformers for type casting see [type casting guide](/docs/guides/type-casting-and-default-values) for more information)                                             |
| useNativeValidation | `boolean`                                        |            | Use native browser validation or use error state                                                                                                                       |
| validators          | `Record<string, IValidator \| IValidatorObject>` |            | Custom field validators (see [validation guide](/docs/guides/validation) for more information)                                                                         |

See [here](/docs/api/types) for the types.

## Returns

`useForm` return an object with the following shape:

| Property            | Type                                      | Description                                                                                                                                                                        |
| ------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| errors              | `IError`                                  | Form errors (see [errors guide](/docs/guides/errors-and-styling) for more information)                                                                                             |
| form                | `RefObject<HTMLFormElement>`              | Form ref                                                                                                                                                                           |
| formProps           | `IFormProps`                              | Form props to add on your form component                                                                                                                                           |
| messages            | `Record<string, string>`                  | Given custom messages                                                                                                                                                              |
| mode                | `'all' \| 'blur' \| 'change' \| 'submit'` | Chosen Validation strategy                                                                                                                                                         |
| onChange            | `IOnChangeHandler`                        | Change handler (see [type casting guide](/docs/guides/type-casting-and-default-values) and [controlled components guide](/docs/guides/controlled-components) for more information) |
| onError             | `IOnErrorHandler`                         | Manual error handler (see [controlled components guide](/docs/guides/controlled-components#managing-manual-errors) for more information)                                           |
| onReset             | `IOnResetHandler`                         | Reset handler (see [reset guide](/docs/guides/submit-and-reset#with-the-onreset-handler) for more information)                                                                     |
| onSubmit            | `IOnSubmitHandler`                        | Submit handler (see [submit guide](/docs/guides/submit-and-reset#using-the-onsubmit-handler) for more information)                                                                 |
| register            | `IRegister`                               | Internal usage                                                                                                                                                                     |
| reset               | `IFormReset`                              | Manual reset function                                                                                                                                                              |
| revalidateMode      | `'blur' \| 'change' \| 'submit'`          | Chosen re-validation strategy                                                                                                                                                      |
| states              | `IFormStates`                             | Form states (warning: these are not react states)                                                                                                                                  |
| subscribe           | `ISubscribe`                              | Function to subscribe to state change (see the [form state guide](http://localhost:3001/react-per-form/docs/guides/form-states#with-the-subscribe-function) for more information)  |
| unregister          | `IUnregister`                             | Internal usage                                                                                                                                                                     |
| useNativeValidation | `boolean`                                 | Choice for native validation or not                                                                                                                                                |
| validate            | `IFormValidate`                           | Manual validate function                                                                                                                                                           |
| watch               | `IWatch`                                  | Manual watch function (see [watch guide](/docs/guides/watch) for more information)                                                                                                 |

See [here](/docs/api/types) for the types.

## Usage

Just add `{...formProps}` to your `<form>` and you are ready:

import SimpleHookProps from '@site/src/demo/SimpleHookProps';
import SimpleHookPropsSource from '!!raw-loader!@site/src/demo/SimpleHookProps';

<Demo Component={SimpleHookProps} code={SimpleHookPropsSource} metastring="{10-13}" withModes withRevalidateModes withUseNativeValidation/>
