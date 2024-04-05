# Validation

## Custom validation

To add some validation on a field just use the `validators` props and set a function for the field (the key must match the name) that either return an error string or empty string if there is no error:

import ValidationHook from '@site/src/demo/ValidationHook';
import ValidationHookSource from '!!raw-loader!@site/src/demo/ValidationHook';
import ValidationComponent from '@site/src/demo/ValidationComponent';
import ValidationComponentSource from '!!raw-loader!@site/src/demo/ValidationComponent';

<DemoTabs Component={ValidationComponent} Hook={ValidationHook} componentCode={ValidationComponentSource} componentMetastring="{5-8,20}" hookCode={ValidationHookSource} hookMetastring="{5-8,19}" />

:::info

If possible declare the validators outside the component to avoid creating a new reference for each new render.

:::

Each validator will receive two parameters:

- the filtered form `values` (You will only get the values of the field the validator is attached to)
- the `names` array associated with the validator (in this case it will be `['text']`).

:::info

With this syntax the key used in the error object will be the name of the field.

:::

If you need to do a validation based on multiple field values check the next section.

## Cross field validation

Cross field validation enable the possibility of having a validator applied on multiples fields at the same time.

Declare the validator using an object with a `names` property listing all related fields and set the validator function in the `validator` property:

import CrossValidationHook from '@site/src/demo/CrossValidationHook';
import CrossValidationHookSource from '!!raw-loader!@site/src/demo/CrossValidationHook';
import CrossValidationComponent from '@site/src/demo/CrossValidationComponent';
import CrossValidationComponentSource from '!!raw-loader!@site/src/demo/CrossValidationComponent';

<DemoTabs Component={CrossValidationComponent} Hook={CrossValidationHook} componentCode={CrossValidationComponentSource} componentMetastring="{5-13,25}" hookCode={CrossValidationHookSource} hookMetastring="{5-13,24}" />

In that case, when the validator does not pass:

- all field in the `all` property of the error object will contain the error.
- the `validator` property of the error object will contain the error using the same id used in the `validators` configuration (here `sum`).
- and the validator error will also be available in the `global` property of the error object.

## Local validation

When your form is complex you might want to split you form into multiple components.

In that case it might be preferable for you to declare the validator with the field and not on the form level.

In such scenario you can use the `useInput` hook to achieve this goal.

Just pass the name of the field and and the validator as parameters of the `useInput` hook.

import LocalValidationHook from '@site/src/demo/LocalValidationHook';
import LocalValidationHookSource from '!!raw-loader!@site/src/demo/LocalValidationHook';
import LocalValidationComponent from '@site/src/demo/LocalValidationComponent';
import LocalValidationComponentSource from '!!raw-loader!@site/src/demo/LocalValidationComponent';

<DemoTabs Component={LocalValidationComponent} Hook={LocalValidationHook} componentCode={LocalValidationComponentSource} componentMetastring="{5-6,9}" hookCode={LocalValidationHookSource} hookMetastring="{6-7,10,25,31,36}" />

:::warning

With the hook version you will have to add yourself the react-swift-form `<FormProvider>` component !

:::

:::info

Such local validator won't be present in the global property of the error object.

:::

## Local cross field validation

You can mix local validation and cross field validation using the `useInputs` hook.

import LocalCrossValidationHook from '@site/src/demo/LocalCrossValidationHook';
import LocalCrossValidationHookSource from '!!raw-loader!@site/src/demo/LocalCrossValidationHook';
import LocalCrossValidationComponent from '@site/src/demo/LocalCrossValidationComponent';
import LocalCrossValidationComponentSource from '!!raw-loader!@site/src/demo/LocalCrossValidationComponent';

<DemoTabs Component={LocalCrossValidationComponent} Hook={LocalCrossValidationHook} componentCode={LocalCrossValidationComponentSource} componentMetastring="{5-9,12}" hookCode={LocalCrossValidationHookSource} hookMetastring="{6-10,13,31,37,42}" />

:::tip

In that case the system will define an id for the validator based on the names (here `'a,b'`).

But you can also pass an object for the `validators` properties where `key` are ids and values are validators:

`useInputs({ names, validators: { sum: validator } })`

:::

## Dynamic field validation

If you need to work with dynamic form, just update the names the validator applies on:

import DynamicValidationHook from '@site/src/demo/DynamicValidationHook';
import DynamicValidationHookSource from '!!raw-loader!@site/src/demo/DynamicValidationHook';
import DynamicValidationComponent from '@site/src/demo/DynamicValidationComponent';
import DynamicValidationComponentSource from '!!raw-loader!@site/src/demo/DynamicValidationComponent';

<DemoTabs Component={DynamicValidationComponent} Hook={DynamicValidationHook} componentCode={DynamicValidationComponentSource} componentMetastring="{5-9,28}" hookCode={DynamicValidationHookSource} hookMetastring="{5-9,27}" />
