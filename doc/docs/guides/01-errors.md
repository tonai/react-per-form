# Errors

By default react-swift-form use native form validation to avoid using any state at all (for performance reason).

But if you want to customize the display of form errors you can turn off the native validation with the `useNativeValidation` parameter.

## With the `useForm` hook

You can directly access the error object from the `useForm` hook:

import SimpleHookNonNative from '@site/src/demo/SimpleHookNonNative';
import SimpleHookNonNativeSource from '!!raw-loader!@site/src/demo/SimpleHookNonNative';

<Demo Component={SimpleHookNonNative} code={SimpleHookNonNativeSource} metastring="{10,18}" />

## With the `<Form>` component

### Render prop method

You can access the error object using the children of the `<Form>` component as a render prop:

import SimpleComponentNonNativeRender from '@site/src/demo/SimpleComponentNonNativeRender';
import SimpleComponentNonNativeRenderSource from '!!raw-loader!@site/src/demo/SimpleComponentNonNativeRender';

<Demo Component={SimpleComponentNonNativeRender} code={SimpleComponentNonNativeRenderSource} metastring="{12,15}"/>

### Context method

Or you can access the error object using the context (in that case you need to use a sub-component).

You can use the `useFormErrors` hook to directly get access to the errors:

import SimpleComponentNonNativeContext from '@site/src/demo/SimpleComponentNonNativeContext';
import SimpleComponentNonNativeContextSource from '!!raw-loader!@site/src/demo/SimpleComponentNonNativeContext';

<Demo Component={SimpleComponentNonNativeContext} code={SimpleComponentNonNativeContextSource} metastring="{5,9}"/>

## The error object

### Description

Inside the error object you can access all errors classified in different categories.

It has the following shape:

| Property  | Type                                                               | Description                                                                                                                                                                                      |
| --------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| native    | `Record<string, string>`                                           | Contains errors only relative to native validation (`required`, `min`, `maxlength`, `pattern`...etc.). Keys are field names and values are error strings (empty string means no error)           |
| validator | `Record<string, {error: string, global: boolean, names: string[]>` | Contains errors only relative to custom field validation (See [guide page about validation](/docs/guides/validation) for more information). Keys are validator id                                |
| manual    | `Record<string, string \| null>`                                   | Contains errors only relative to manual validation (See [guide page about validation](/docs/guides/validation) for more information). Keys are field names                                       |
| global    | `Record<string, {error: string, global: boolean, names: string[]>` | Contains errors only relative to custom field validation that are set at the form level (See [guide page about validation](/docs/guides/validation) for more information). Keys are validator id |
| all       | `Record<string, string>`                                           | Contains all above errors, with one error per field (native errors first, then manual errors, then validator errors). Keys are field names                                                       |
| main      | `{error: string, global: boolean, id: string, names: string[] }`   | Contain the first field error (from top to bottom).                                                                                                                                              |

### Example

This example showcase all type of errors:

import HookErrors from '@site/src/demo/HookErrors';
import HookErrorsSource from '!!raw-loader!@site/src/demo/HookErrors';
import ComponentErrors from '@site/src/demo/ComponentErrors';
import ComponentErrorsSource from '!!raw-loader!@site/src/demo/ComponentErrors';

<DemoTabs Component={ComponentErrors} Hook={HookErrors} componentCode={ComponentErrorsSource} componentMetastring="{21-23,35,37,39}" hookCode={HookErrorsSource} hookMetastring="{21-23,35,37,39}" withModes withRevalidateModes />

1. Submit without choosing any date and you will trigger the native validation (with the `required` attribute)
2. Choose a date that is before the 15th of each month to trigger the validation error (with the validator).
3. Enter a date like 01/01/2024 to see the error send back by the Material UI component (what we call "manual error", see the [controlled components guide](/docs/guides/controlled-components#ui-library) for more information).

:::info

`global` contains the same as `validator` because validators are set at the form level.

Check [local validation](/docs/guides/validation#local-validation) for non global validators.

:::
