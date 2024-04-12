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

Controlled components get their value from the `onChange` handler.

You can cast yourself the transformer function on `event.target.value` but react-swift-form gives you a way to this automatically for you.

In that case you can use the `onChange` handler to wrap your update state function and it will receive the transformed value :

import SimpleHookControlledCast from '@site/src/demo/SimpleHookControlledCast';
import SimpleHookControlledCastSource from '!!raw-loader!@site/src/demo/SimpleHookControlledCast';
import SimpleComponentControlledCast from '@site/src/demo/SimpleComponentControlledCast';
import SimpleComponentControlledCastSource from '!!raw-loader!@site/src/demo/SimpleComponentControlledCast';

<DemoTabs Component={SimpleComponentControlledCast} Hook={SimpleHookControlledCast} componentCode={SimpleComponentControlledCastSource} componentMetastring="{6,9,12,26,28,32,38}" hookCode={SimpleHookControlledCastSource} hookMetastring="{6,9,12,20,25,32,39}" withModes withRevalidateModes />

:::info

If you want to have default values, like for [the type casting example](/docs/guides/type-casting-and-default-values#with-type-casting), you need to provide them using the `defaultValues` parameter or the `defaultValue` props.

:::

## UI libraries

### Using the `onChange` handler

The `onChange` handler you use for updating the state can automatically infer the component name from the `ChangeEvent` object returned by react.

But in some scenario UI libraries sometimes directly send the value in the `onChange` callback instead of an event object.

In that case you can provide the name yourself by using second parameter of the `onChange` handler:

import DatepickerHookControlled from '@site/src/demo/DatepickerHookControlled';
import DatepickerHookControlledSource from '!!raw-loader!@site/src/demo/DatepickerHookControlled';
import DatepickerComponentControlled from '@site/src/demo/DatepickerComponentControlled';
import DatepickerComponentControlledSource from '!!raw-loader!@site/src/demo/DatepickerComponentControlled';

<DemoTabs Component={DatepickerComponentControlled} Hook={DatepickerHookControlled} componentCode={DatepickerComponentControlledSource} componentMetastring="{11,25,26}" hookCode={DatepickerHookControlledSource} hookMetastring="{11,29,30}" withModes withRevalidateModes />

:::info

Remember to use the `onReset` parameter or the `onReset` handler to effectively reset the state if you need to.

:::

:::note

The value displayed under the form when you submit is the serialization of the Dayjs value.

But the value you get in your `onSubmit` callback is a real Dayjs value. Check the console !

:::

### Manual errors

#### With the `onError` handler

Some components you may use manage validation internally, in that case you can use the `onError` handler to forward the error to react-swift-form.

The `onError` handler accept one argument, the name of the form field, and return a new function that accept the error string as argument (or `null` if there is no error) :

import DatepickerHookControlledOnError from '@site/src/demo/DatepickerHookControlledOnError';
import DatepickerHookControlledOnErrorSource from '!!raw-loader!@site/src/demo/DatepickerHookControlledOnError';
import DatepickerComponentControlledOnError from '@site/src/demo/DatepickerComponentControlledOnError';
import DatepickerComponentControlledOnErrorSource from '!!raw-loader!@site/src/demo/DatepickerComponentControlledOnError';

<DemoTabs Component={DatepickerComponentControlledOnError} Hook={DatepickerHookControlledOnError} componentCode={DatepickerComponentControlledOnErrorSource} componentMetastring="{24,27}" hookCode={DatepickerHookControlledOnErrorSource} hookMetastring="{28,31}" withModes withRevalidateModes />

:::info

Try to manually enter a date like 01/01/2024 to see the error.

:::

:::tip

You can customize the error message with something like `onError={(error) => onError('mui')(messages[error])}` for example.

But you can also customize the error message using react-swift-form `messages` parameter.

Check the chapter about [messages and i18n](/docs/guides/messages-and-i18n) for more information.

:::

#### With the `onChange` handler

Sometimes the error is given using the `onChange` callback.

In that case you can use the second parameter of the `onChange` handler and set the `getError` property with a function that will be responsible to return the error.

The `getError` will get the value as first argument (potentially transformed if `transformers` parameter is used) and will get all other arguments from the original `onChange` callback:

import DatepickerHookControlledOnChange from '@site/src/demo/DatepickerHookControlledOnChange';
import DatepickerHookControlledOnChangeSource from '!!raw-loader!@site/src/demo/DatepickerHookControlledOnChange';
import DatepickerComponentControlledOnChange from '@site/src/demo/DatepickerComponentControlledOnChange';
import DatepickerComponentControlledOnChangeSource from '!!raw-loader!@site/src/demo/DatepickerComponentControlledOnChange';

<DemoTabs Component={DatepickerComponentControlledOnChange} Hook={DatepickerHookControlledOnChange} componentCode={DatepickerComponentControlledOnChangeSource} componentMetastring="{19-21,28,30,32}" hookCode={DatepickerHookControlledOnChangeSource} hookMetastring="{19-21,32,34,36}" withModes withRevalidateModes />

### Default values

Use the `defaultValues` parameter to initialize the default values.

Of course, for controlled components you should initialize your state with the same value:

import DatepickerHookControlledDefaultValues from '@site/src/demo/DatepickerHookControlledDefaultValues';
import DatepickerHookControlledDefaultValuesSource from '!!raw-loader!@site/src/demo/DatepickerHookControlledDefaultValues';
import DatepickerComponentControlledDefaultValues from '@site/src/demo/DatepickerComponentControlledDefaultValues';
import DatepickerComponentControlledDefaultValuesSource from '!!raw-loader!@site/src/demo/DatepickerComponentControlledDefaultValues';

<DemoTabs Component={DatepickerComponentControlledDefaultValues} Hook={DatepickerHookControlledDefaultValues} componentCode={DatepickerComponentControlledDefaultValuesSource} componentMetastring="{7,10,13,24}" hookCode={DatepickerHookControlledDefaultValuesSource} hookMetastring="{7,10,13,23}" withModes withRevalidateModes />

### Validators and `onChange` event opt-out

When using some controlled component with custom validators you can sometimes receive weird values.

You probably expect to receive a `Dayjs` value in the validator, but in such scenario you will also get badly formatted date strings like `'01/MM/YYYY'` that can break you validator (because when you manually enter a date, it will trigger the native `onChange` event that will read the input.
).

You have two options:

1. Managing the case in your validator.
2. Or opting-out for the native `onChange` event for this field (and only rely on the `onChange` props).

You can opt-out using the `onChangeOptOut` parameter that accept a string, a list of strings or `'all'` to opt-out for all fields.

Opting-out won't be enough because validation is also triggered during initialization, so your validator will still be called with some string (in this example, empty string `""`), but you can also fix that problem by providing a default value:

import DatepickerHookControlledValidators from '@site/src/demo/DatepickerHookControlledValidators';
import DatepickerHookControlledValidatorsSource from '!!raw-loader!@site/src/demo/DatepickerHookControlledValidators';
import DatepickerComponentControlledValidators from '@site/src/demo/DatepickerComponentControlledValidators';
import DatepickerComponentControlledValidatorsSource from '!!raw-loader!@site/src/demo/DatepickerComponentControlledValidators';

<DemoTabs Component={DatepickerComponentControlledValidators} Hook={DatepickerHookControlledValidators} componentCode={DatepickerComponentControlledValidatorsSource} componentMetastring="{7-13,30,31,34}" hookCode={DatepickerHookControlledValidatorsSource} hookMetastring="{7-13,29,30,33}" withModes withRevalidateModes />

:::note

Select a date before the 15th of each month to see the error.

:::

### Uncontrolled

You can still use such components in an uncontrolled way.

In that case you won't receive a `Dayjs` object as value, but you can use the `transformers` props for that converting purpose if you want.

import DatepickerHookUncontrolled from '@site/src/demo/DatepickerHookUncontrolled';
import DatepickerHookUncontrolledSource from '!!raw-loader!@site/src/demo/DatepickerHookUncontrolled';
import DatepickerComponentUncontrolled from '@site/src/demo/DatepickerComponentUncontrolled';
import DatepickerComponentUncontrolledSource from '!!raw-loader!@site/src/demo/DatepickerComponentUncontrolled';

<DemoTabs Component={DatepickerComponentUncontrolled} Hook={DatepickerHookUncontrolled} componentCode={DatepickerComponentUncontrolledSource} componentMetastring="{7,8,17,21}" hookCode={DatepickerHookUncontrolledSource} hookMetastring="{7,8,19,25}" withModes withRevalidateModes />

:::note

The problem with that example is that we can't reset the `<DatePicker>` component value from outside (using the reset button).

:::
