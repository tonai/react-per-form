# Validation

## Custom validation

To add some validation on a field just use the `validators` parameter and set a function for the field (the key must match the name) that either return an error string or empty string if there is no error:

import ValidationHook from '@site/src/demo/ValidationHook';
import ValidationHookSource from '!!raw-loader!@site/src/demo/ValidationHook';
import ValidationComponent from '@site/src/demo/ValidationComponent';
import ValidationComponentSource from '!!raw-loader!@site/src/demo/ValidationComponent';

<DemoTabs Component={ValidationComponent} Hook={ValidationHook} componentCode={ValidationComponentSource} componentMetastring="{5-8,19}" hookCode={ValidationHookSource} hookMetastring="{5-8,18}" />

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

## Async validation

Validator can also return a promise containing the error string:

import AsyncValidationHook from '@site/src/demo/AsyncValidationHook';
import AsyncValidationHookSource from '!!raw-loader!@site/src/demo/AsyncValidationHook';
import AsyncValidationComponent from '@site/src/demo/AsyncValidationComponent';
import AsyncValidationComponentSource from '!!raw-loader!@site/src/demo/AsyncValidationComponent';

<DemoTabs Component={AsyncValidationComponent} Hook={AsyncValidationHook} componentCode={AsyncValidationComponentSource} componentMetastring="{6-11,22}" hookCode={AsyncValidationHookSource} hookMetastring="{6-11,21}" />

:::note

In this example `delay` is just a function that return a Promise that will be resolved after 1s.

:::

## Cross field validation

Cross field validation enable the possibility of having a validator applied on multiples fields at the same time.

Declare the validator using an object with a `names` property listing all related fields and set the validator function in the `validator` property:

import CrossValidationHook from '@site/src/demo/CrossValidationHook';
import CrossValidationHookSource from '!!raw-loader!@site/src/demo/CrossValidationHook';
import CrossValidationComponent from '@site/src/demo/CrossValidationComponent';
import CrossValidationComponentSource from '!!raw-loader!@site/src/demo/CrossValidationComponent';

<DemoTabs Component={CrossValidationComponent} Hook={CrossValidationHook} componentCode={CrossValidationComponentSource} componentMetastring="{5-13,24}" hookCode={CrossValidationHookSource} hookMetastring="{5-13,23}" />

In that case, when the validator does not pass:

- all field in the `all` property of the error object will contain the error.
- the `validator` property of the error object will contain the error using the same id used in the `validators` configuration (here `sum`).
- and the validator error will also be available in the `global` property of the error object.

## Dynamic field validation

If you need to work with dynamic form, just update the names the validator applies on:

import DynamicValidationHook from '@site/src/demo/DynamicValidationHook';
import DynamicValidationHookSource from '!!raw-loader!@site/src/demo/DynamicValidationHook';
import DynamicValidationComponent from '@site/src/demo/DynamicValidationComponent';
import DynamicValidationComponentSource from '!!raw-loader!@site/src/demo/DynamicValidationComponent';

<DemoTabs Component={DynamicValidationComponent} Hook={DynamicValidationHook} componentCode={DynamicValidationComponentSource} componentMetastring="{5-9,27}" hookCode={DynamicValidationHookSource} hookMetastring="{5-9,26}" />
