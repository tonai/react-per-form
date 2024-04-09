# Submit and reset

## Submit ans submit error

### With the `onSubmit` parameter

You can listen to the form being submitted with the `onSubmit` parameter you can provide on both the `useForm` hook or the `<Form>` component:

import SimpleHookProps from '@site/src/demo/SimpleHookProps';
import SimpleHookPropsSource from '!!raw-loader!@site/src/demo/SimpleHookProps';
import SimpleComponentProps from '@site/src/demo/SimpleComponentProps';
import SimpleComponentPropsSource from '!!raw-loader!@site/src/demo/SimpleComponentProps';

<DemoTabs Component={SimpleComponentProps} Hook={SimpleHookProps} componentCode={SimpleComponentPropsSource} componentMetastring="{6-9,12}" hookCode={SimpleHookPropsSource} hookMetastring="{6-9,13}" withModes withRevalidateModes />

:::tip

When using client side form submission, do not forget to prevent the default behavior of the form being submitted with `preventDefault()` on the event object.

:::

### Submit error with the `onSubmitError` parameter

:::warning

This option only works when `useNativeValidation` is set to `false`.

:::

You can get the form error using the `onSubmitError` parameter:

import SimpleHookSubmitError from '@site/src/demo/SimpleHookSubmitError';
import SimpleHookSubmitErrorSource from '!!raw-loader!@site/src/demo/SimpleHookSubmitError';
import SimpleComponentSubmitError from '@site/src/demo/SimpleComponentSubmitError';
import SimpleComponentSubmitErrorSource from '!!raw-loader!@site/src/demo/SimpleComponentSubmitError';

<DemoTabs Component={SimpleComponentSubmitError} Hook={SimpleHookSubmitError} componentCode={SimpleComponentSubmitErrorSource} componentMetastring="{16-17,21}" hookCode={SimpleHookSubmitErrorSource} hookMetastring="{11-13,18}" withModes withRevalidateModes withUseNativeValidation={false} />

:::info

Open the console to see the logs.

:::

### Using the `onSubmit` handler

For the hook version you can also use the `onSubmit` handler if you prefer.

You can also provide a second parameter for the submit error callback (that again only works with non native validation) :

import SimpleHookSubmit from '@site/src/demo/SimpleHookSubmit';
import SimpleHookSubmitSource from '!!raw-loader!@site/src/demo/SimpleHookSubmit';

<Demo Component={SimpleHookSubmit} code={SimpleHookSubmitSource} metastring="{15,18}" withModes withRevalidateModes withUseNativeValidation />

## Reset

### With a button

If you want to reset you form using a button just add a `<button type="reset">` to your form :

import SimpleHookReset from '@site/src/demo/SimpleHookReset';
import SimpleHookResetSource from '!!raw-loader!@site/src/demo/SimpleHookReset';
import SimpleComponentReset from '@site/src/demo/SimpleComponentReset';
import SimpleComponentResetSource from '!!raw-loader!@site/src/demo/SimpleComponentReset';

<DemoTabs Component={SimpleComponentReset} Hook={SimpleHookReset} componentCode={SimpleComponentResetSource} componentMetastring="{19}" hookCode={SimpleHookResetSource} hookMetastring="{22}" withModes withRevalidateModes />

The reset action will clear all values and will reset all errors.

:::warning

For controlled component [see the dedicated chapter](/docs/guides/controlled-components).

:::

### Programmatically

If you want to reset the form programmatically (for example when the form is submitted), then use the `reset` function.

You can get the `reset` function from the `useForm` hook, but it is also provided as the third parameter of your submit handler:

import SimpleHookResetFunction from '@site/src/demo/SimpleHookResetFunction';
import SimpleHookResetFunctionSource from '!!raw-loader!@site/src/demo/SimpleHookResetFunction';
import SimpleComponentResetFunction from '@site/src/demo/SimpleComponentResetFunction';
import SimpleComponentResetFunctionSource from '!!raw-loader!@site/src/demo/SimpleComponentResetFunction';

<DemoTabs Component={SimpleComponentResetFunction} Hook={SimpleHookResetFunction} componentCode={SimpleComponentResetFunctionSource} componentMetastring="{14,17}" hookCode={SimpleHookResetFunctionSource} hookMetastring="{8,12}" withModes withRevalidateModes />

:::tip

You can also pass an object parameter to the reset function to programmatically reset the form to specific values.

:::

## Resetting to specific values

If you want to reset your form to specific values you can use the `defaultValues` parameter to set some value initially on the form and then reset the form using those values again (see [default values](/docs/guides/type-casting-and-default-values#default-values) for more information).

But if you don't want those value initially, you can reset the form to some specific values with one of the following techniques.

:::tip

Even if you don't return anything from your `onReset` callbacks, it can still be useful to react to the reset event.

For example if you want to update the state of a controlled component (see [controlled components](/docs/guides/controlled-components) for more information).

:::

### With the `onReset` parameter

Return an object from the `onReset` function parameter:

import SimpleHookOnReset from '@site/src/demo/SimpleHookOnReset';
import SimpleHookOnResetSource from '!!raw-loader!@site/src/demo/SimpleHookOnReset';
import SimpleComponentOnReset from '@site/src/demo/SimpleComponentOnReset';
import SimpleComponentOnResetSource from '!!raw-loader!@site/src/demo/SimpleComponentOnReset';

<DemoTabs Component={SimpleComponentOnReset} Hook={SimpleHookOnReset} componentCode={SimpleComponentOnResetSource} componentMetastring="{6-8,16}" hookCode={SimpleHookOnResetSource} hookMetastring="{6-8,17}" withModes withRevalidateModes />

### With the `onReset` handler

For the hook version you can also use the `onReset` handler if you prefer:

import SimpleHookOnResetHandler from '@site/src/demo/SimpleHookOnResetHandler';
import SimpleHookOnResetHandlerSource from '!!raw-loader!@site/src/demo/SimpleHookOnResetHandler';

<Demo Component={SimpleHookOnResetHandler} code={SimpleHookOnResetHandlerSource} metastring="{6-8,15,20}" withModes withRevalidateModes withUseNativeValidation />
