# Controlled components

react-swift-form use uncontrolled components for performance reason but having controlled component can still be useful in some cases:

- you want to react to each key stroke in a text field (filtering, searching...etc.)
- you want to have dynamic things depending on form values
- you want to use an UI library that was design with controlled components (like Material UI...etc.)
- ...etc.

:::tip

You can sometimes have the same result using the `watch` function instead of using controlled components. See the [watch guide](/docs/guides/watch) for more information.

:::

## Simple controlled component

Let's imagine wa want to synchronize our text input to be able to do some filtering on a list.

Then you can just declare a state and use `value` (or `checked` for checkbox and radio buttons) and `onChange` as you would normally do.

But if you want to reset the form, you also need to update the state of the component on the reset event.

For that you can use the `onReset` parameter (or the `onReset` handler, see the [reset guide](/docs/guides/submit-and-reset#resetting-to-specific-values) for more information):

import SimpleHookControlled from '@site/src/demo/SimpleHookControlled';
import SimpleHookControlledSource from '!!raw-loader!@site/src/demo/SimpleHookControlled';
import SimpleComponentControlled from '@site/src/demo/SimpleComponentControlled';
import SimpleComponentControlledSource from '!!raw-loader!@site/src/demo/SimpleComponentControlled';

<DemoTabs Component={SimpleComponentControlled} Hook={SimpleHookControlled} componentCode={SimpleComponentControlledSource} componentMetastring="{6,8-10,12-14,22,25,27}" hookCode={SimpleHookControlledSource} hookMetastring="{6,8-10,12-14,23,29,31}" withModes withRevalidateModes />

:::note

react-swift-form do not manage the state of your form, you are free to use state if you want, but it's your responsibility to manage it correctly.

:::

## Controlled component with type casting

Type casting require you to also use the `onChange` props (see the [type casting guide](/docs/guides/type-casting-and-default-values) for more information).

In case of controlled component you can use the `onChange` handler to do both the type casting and updating the state:

import SimpleHookControlledCast from '@site/src/demo/SimpleHookControlledCast';
import SimpleHookControlledCastSource from '!!raw-loader!@site/src/demo/SimpleHookControlledCast';
import SimpleComponentControlledCast from '@site/src/demo/SimpleComponentControlledCast';
import SimpleComponentControlledCastSource from '!!raw-loader!@site/src/demo/SimpleComponentControlledCast';

<DemoTabs Component={SimpleComponentControlledCast} Hook={SimpleHookControlledCast} componentCode={SimpleComponentControlledCastSource} componentMetastring="{5,8,11,22,26,30,36}" hookCode={SimpleHookControlledCastSource} hookMetastring="{5,8,11,19,21,30,37}" withModes withRevalidateModes />

:::info

If you want to have default values, like for the classic type casting case, you need to provide them using the `defaultValues` parameter.

:::

## UI library

### Managing the name with `onChange`

The `onChange` handler you use for updating the state or do some type casting can automatically infer the component name from the `ChangeEvent` object returned by react.

But in some scenario UI libraries sometimes directly send the value in the `onChange` callback instead of an event object.

In that case you can provide the name yourself by using the `name` property for the `onChange` parameter:

import DatepickerHookControlled from '@site/src/demo/DatepickerHookControlled';
import DatepickerHookControlledSource from '!!raw-loader!@site/src/demo/DatepickerHookControlled';
import DatepickerComponentControlled from '@site/src/demo/DatepickerComponentControlled';
import DatepickerComponentControlledSource from '!!raw-loader!@site/src/demo/DatepickerComponentControlled';

<DemoTabs Component={DatepickerComponentControlled} Hook={DatepickerHookControlled} componentCode={DatepickerComponentControlledSource} componentMetastring="{7,10,13,32}" hookCode={DatepickerHookControlledSource} hookMetastring="{7,10,13,32}" withModes withRevalidateModes />

:::note

The value displayed under the form when you submit is the serialization of the Dayjs value.

But the value you get in your `onSubmit` callback is a real Dayjs value. Check the console !

:::

### Managing manual errors

#### With the `onError` handler

Sometimes some components manage validation internally, in that case you can use the `onError` handler to forward the error to react-swift-form.

The `onError` handler accept one argument, the name of the form field, and return a new function that accept the error string as argument (or `null` if there is no error) :

import DatepickerHookControlledOnError from '@site/src/demo/DatepickerHookControlledOnError';
import DatepickerHookControlledOnErrorSource from '!!raw-loader!@site/src/demo/DatepickerHookControlledOnError';
import DatepickerComponentControlledOnError from '@site/src/demo/DatepickerComponentControlledOnError';
import DatepickerComponentControlledOnErrorSource from '!!raw-loader!@site/src/demo/DatepickerComponentControlledOnError';

<DemoTabs Component={DatepickerComponentControlledOnError} Hook={DatepickerHookControlledOnError} componentCode={DatepickerComponentControlledOnErrorSource} componentMetastring="{31,34}" hookCode={DatepickerHookControlledOnErrorSource} hookMetastring="{31,34}" withModes withRevalidateModes />

:::info

Try to manually enter a date like 01/01/2024 to see the error.

:::

:::tip

You can customize the error message with something like `onError={(error) => onError('mui')(messages[error])}` for example.

But you can also customize the error message using react-swift-form, check the chapter about [messages and i18n](/docs/guides/messages-and-i18n) for more information.

:::

#### With the `onChange` handler

And sometimes the error is given using the `onChange` callback.

In that case you can use the `getError` property and put a function which will be responsible to return the error.

The `getError` will get the value as first argument (potentially transformed if `transformer` function is used) and will get all other arguments from the original `onChange` callback:

import DatepickerHookControlledOnChange from '@site/src/demo/DatepickerHookControlledOnChange';
import DatepickerHookControlledOnChangeSource from '!!raw-loader!@site/src/demo/DatepickerHookControlledOnChange';
import DatepickerComponentControlledOnChange from '@site/src/demo/DatepickerComponentControlledOnChange';
import DatepickerComponentControlledOnChangeSource from '!!raw-loader!@site/src/demo/DatepickerComponentControlledOnChange';

<DemoTabs Component={DatepickerComponentControlledOnChange} Hook={DatepickerHookControlledOnChange} componentCode={DatepickerComponentControlledOnChangeSource} componentMetastring="{21-23,35,37,39}" hookCode={DatepickerHookControlledOnChangeSource} hookMetastring="{21-23,35,37,39}" withModes withRevalidateModes />
