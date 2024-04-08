# Submit and reset

## Submit

You can listen to the form being submitted with the `onSubmit` parameter you can provide on both the `useForm` hook or the `<Form>` component:

import SimpleHookProps from '@site/src/demo/SimpleHookProps';
import SimpleHookPropsSource from '!!raw-loader!@site/src/demo/SimpleHookProps';
import SimpleComponentProps from '@site/src/demo/SimpleComponentProps';
import SimpleComponentPropsSource from '!!raw-loader!@site/src/demo/SimpleComponentProps';

<DemoTabs Component={SimpleComponentProps} Hook={SimpleHookProps} componentCode={SimpleComponentPropsSource} componentMetastring="{6-9,12}" hookCode={SimpleHookPropsSource} hookMetastring="{6-9,13}" withModes withRevalidateModes />

:::tip

When using client side form submission, do not forget to prevent the default behavior of the form being submitted with `preventDefault()` on the event object.

:::

## Submit error

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

## Using the `onSubmit` handler

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

## Programmatically

If you want to reset the form programmatically (for example when the form is submitted), then use the `reset` function.

You can get the `reset` function from the `useForm` hook, but it is also provided as the third parameter of your submit handler:

import SimpleHookResetFunction from '@site/src/demo/SimpleHookResetFunction';
import SimpleHookResetFunctionSource from '!!raw-loader!@site/src/demo/SimpleHookResetFunction';
import SimpleComponentResetFunction from '@site/src/demo/SimpleComponentResetFunction';
import SimpleComponentResetFunctionSource from '!!raw-loader!@site/src/demo/SimpleComponentResetFunction';

<DemoTabs Component={SimpleComponentResetFunction} Hook={SimpleHookResetFunction} componentCode={SimpleComponentResetFunctionSource} componentMetastring="{14,17}" hookCode={SimpleHookResetFunctionSource} hookMetastring="{8,12}" withModes withRevalidateModes />
