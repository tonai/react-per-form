# Errors and styling

By default react-swift-form use native form validation to avoid using any state at all (for performance reason).

But if you want to customize the display of form errors you can turn off the native validation with the `useNativeValidation` parameter.

## With the `useForm` hook

You can directly access the error object from the `useForm` hook:

import SimpleHookNonNative from '@site/src/demo/SimpleHookNonNative';
import SimpleHookNonNativeSource from '!!raw-loader!@site/src/demo/SimpleHookNonNative';

<Demo Component={SimpleHookNonNative} code={SimpleHookNonNativeSource} metastring="{9,17}" />

## With the `<Form>` component

### Render prop method

You can access the error object using the children of the `<Form>` component as a render prop:

import SimpleComponentNonNativeRender from '@site/src/demo/SimpleComponentNonNativeRender';
import SimpleComponentNonNativeRenderSource from '!!raw-loader!@site/src/demo/SimpleComponentNonNativeRender';

<Demo Component={SimpleComponentNonNativeRender} code={SimpleComponentNonNativeRenderSource} metastring="{11,14}"/>

### Context method

Or you can access the error object using the context (in that case you need to use a sub-component).

You can use the `useFormErrors` hook to directly get access to the errors:

import SimpleComponentNonNativeContext from '@site/src/demo/SimpleComponentNonNativeContext';
import SimpleComponentNonNativeContextSource from '!!raw-loader!@site/src/demo/SimpleComponentNonNativeContext';

<Demo Component={SimpleComponentNonNativeContext} code={SimpleComponentNonNativeContextSource} metastring="{5,9}"/>

## Styling

### With CSS pseudo-classes

You can use `:valid` and `:invalid` CSS pseudo-classes to customize your fields depending on their internal validation state.

This works even you choose not to use the native validation:

import SimpleHookCssPseudoClass from '@site/src/demo/SimpleHookCssPseudoClass';
import SimpleHookCssPseudoClassSource from '!!raw-loader!@site/src/demo/SimpleHookCssPseudoClass';
import SimpleComponentCssPseudoClass from '@site/src/demo/SimpleComponentCssPseudoClass';
import SimpleComponentCssPseudoClassSource from '!!raw-loader!@site/src/demo/SimpleComponentCssPseudoClass';

<DemoTabs Component={SimpleComponentCssPseudoClass} Hook={SimpleHookCssPseudoClass} componentCode={SimpleComponentCssPseudoClassSource} componentMetastring="{7-16,26}" hookCode={SimpleHookCssPseudoClassSource} hookMetastring="{7-16,29}" />

:::info

A field is always either valid or invalid, so the style always applies.

:::

### With CSS classes

You can also use the `error` object to style your input if you want to.

The difference with the previous example is that it waits for you to submit the form before applying the styles:

import SimpleHookClassName from '@site/src/demo/SimpleHookClassName';
import SimpleHookClassNameSource from '!!raw-loader!@site/src/demo/SimpleHookClassName';
import SimpleComponentClassName from '@site/src/demo/SimpleComponentClassName';
import SimpleComponentClassNameSource from '!!raw-loader!@site/src/demo/SimpleComponentClassName';

<DemoTabs Component={SimpleComponentClassName} Hook={SimpleHookClassName} componentCode={SimpleComponentClassNameSource} componentMetastring="{15}" hookCode={SimpleHookClassNameSource} hookMetastring="{18}" />

:::tip

You can also mix and match CSS classes with `:valid` and `:invalid` CSS pseudo-classes.

In this example we use the following CSS:

```css
.has-error {
  background-color: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.8);
  border-radius: 2px;
}

.has-error:valid {
  background-color: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.8);
  border-radius: 2px;
}
```

:::

:::note

You can also use the `:has` pseudo-class to achieve the same goal.

A CSS selector like `input:has(+ .error)` will apply some style on your input if it is followed by a element who has an `"error"` class.

:::

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

<DemoTabs Component={ComponentErrors} Hook={HookErrors} componentCode={ComponentErrorsSource} hookCode={HookErrorsSource} />

1. Submit without choosing any date and you will trigger the native validation (with the `required` attribute)
2. Choose a date that is before the 15th of each month to trigger the validation error (with the validator).
3. Enter a date like 01/01/2024 to see the error send back by the Material UI component (what we call "manual error", see the [controlled components guide](/docs/guides/controlled-components#ui-library) for more information).

:::info

`global` contains the same as `validator` because validators are set at the form level.

Check [local validation](/docs/guides/validation#local-validation) for non global validators.

:::
