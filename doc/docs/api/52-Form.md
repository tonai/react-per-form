# `<Form>`

The `<Form>` component is the alternative way to initialize a react-swift-form form (it uses `useForm` and `<FormProvider>` internally).

## Props

`<Form>` takes the following props:

| Property            | Type                                               | Default    | Description                                                                                                                                                            |
| ------------------- | -------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| children            | `ReactNode \| ((data: IFormContext) => ReactNode)` |            | The `<Form>` children. Can be used as a render props to get the form context                                                                                           |
| defaultValues       | `Record<string, unknown>`                          |            | Form default values (see [default values guide](/docs/guides/type-casting-and-default-values#default-values) for more information)                                     |
| focusOnError        | `boolean`                                          | `true`     | Focus the first field error or not                                                                                                                                     |
| form                | `HTMLFormElement`                                  | `null`     | Form ref                                                                                                                                                               |
| messages            | `Record<string, string>`                           |            | Custom messages (see [messages guide](/docs/guides/messages-and-i18n) for more information)                                                                            |
| mode                | `'all' \| 'blur' \| 'change' \| 'submit'`          | `'submit'` | Validation strategy (see [mode guide](/docs/guides/modes) for more information)                                                                                        |
| onBlurOptOut        | `string[] \| string`                               |            | Opt-out for native `onBlur` event                                                                                                                                      |
| onChangeOptOut      | `string[] \| string`                               |            | Opt-out for native `onChange` event (see [controlled components guide](/docs/guides/controlled-components#validators-and-onchange-event-opt-out) for more information) |
| onReset             | `IResetHandler`                                    |            | Reset callback                                                                                                                                                         |
| onSubmit            | `ISubmitHandler`                                   |            | Submit callback                                                                                                                                                        |
| onSubmitError       | `ISubmitErrorHandler`                              |            | Submit error callback (only when `useNativeValidation=false`)                                                                                                          |
| revalidateMode      | `'blur' \| 'change' \| 'submit'`                   | `'submit'` | Re-validation strategy (see [mode guide](/docs/guides/modes) for more information)                                                                                     |
| transformers        | `Record<string, (value: unknown) => unknown>`      |            | Transformers for type casting see [type casting guide](/docs/guides/type-casting-and-default-values) for more information)                                             |
| useNativeValidation | `boolean`                                          |            | Use native browser validation or use error state                                                                                                                       |
| validators          | `Record<string, IValidator \| IValidatorObject>`   |            | Custom field validators (see [validation guide](/docs/guides/validation) for more information)                                                                         |
| ...rest             | `unknown[]`                                        |            | All other props are forwarded to the `<form>` element                                                                                                                  |

See [here](/docs/api/types) for the types.

## Usage

import SimpleComponentProps from '@site/src/demo/SimpleComponentProps';
import SimpleComponentPropsSource from '!!raw-loader!@site/src/demo/SimpleComponentProps';

<Demo Component={SimpleComponentProps} code={SimpleComponentPropsSource} metastring="{12,20}" withModes withRevalidateModes withUseNativeValidation/>
