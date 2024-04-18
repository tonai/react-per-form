# Local fields

## Local validation

When your form is complex you might want to split you form into multiple components.

In that case it might be preferable for you to declare the validator with the field and not on the form level.

In such scenario you can use the `useInput` hook to achieve this goal.

Just pass the name of the field and and the validator as parameters of the `useInput` hook.

import LocalValidationHook from '@site/src/demo/LocalValidationHook';
import LocalValidationHookSource from '!!raw-loader!@site/src/demo/LocalValidationHook';
import LocalValidationComponent from '@site/src/demo/LocalValidationComponent';
import LocalValidationComponentSource from '!!raw-loader!@site/src/demo/LocalValidationComponent';

<DemoTabs Component={LocalValidationComponent} Hook={LocalValidationHook} componentCode={LocalValidationComponentSource} componentMetastring="{5-6,9}" hookCode={LocalValidationHookSource} hookMetastring="{6-7,10,24,30,35}" withModes withRevalidateModes />

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

<DemoTabs Component={LocalCrossValidationComponent} Hook={LocalCrossValidationHook} componentCode={LocalCrossValidationComponentSource} componentMetastring="{5-9,12}" hookCode={LocalCrossValidationHookSource} hookMetastring="{6-10,13,30,36,41}" withModes withRevalidateModes />

:::tip

In that case the system will define an id for the validator based on the names (here `'a,b'`).

But you can also pass an object for the `validators` property where `key` are ids and values are validators:

`useInputs({ names, validators: { sum: validator } })`

Or simply use the `id` property on `useInputs` (it only works if you provide one validator):

`useInputs({ id: 'sum', names, validators: validator })`

:::

## Default values and transformers

You can also provide default values and transformers for local fields:

import LocalValidationHookDefaultValue from '@site/src/demo/LocalValidationHookDefaultValue';
import LocalValidationHookDefaultValueSource from '!!raw-loader!@site/src/demo/LocalValidationHookDefaultValue';
import LocalValidationComponentDefaultValue from '@site/src/demo/LocalValidationComponentDefaultValue';
import LocalValidationComponentDefaultValueSource from '!!raw-loader!@site/src/demo/LocalValidationComponentDefaultValue';

<DemoTabs Component={LocalValidationComponentDefaultValue} Hook={LocalValidationHookDefaultValue} componentCode={LocalValidationComponentDefaultValueSource} componentMetastring="{7,9}" hookCode={LocalValidationHookDefaultValueSource} hookMetastring="{8,10}" withModes withRevalidateModes />
