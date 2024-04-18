# `useFormStates`

`useFormStates` return the form states as a React state from the form context.

## Parameters

There is no parameters for `useFormStates`.

## Returns

`useFormStates` returns the form React states as an object:

| Property      | Type       | Description                                                                  |
| ------------- | ---------- | ---------------------------------------------------------------------------- |
| changedFields | `string[]` | List of fields the user has changed                                          |
| dirtyFields   | `string[]` | List of fields the user has changed and values are different to default ones |
| isDirty       | `boolean`  | Whether the form is dirty or not (at least one field is dirty)               |
| isPristine    | `boolean`  | Inverse of `isDirty`                                                         |
| isReady       | `boolean`  | Indicates when the form is ready                                             |
| isSubmitted   | `boolean`  | `true` when the form has been submitted at least once                        |
| isSubmitting  | `boolean`  | Indicates when the form is being submitted                                   |
| isValid       | `boolean`  | Whether the form is valid or not                                             |
| isValidating  | `boolean`  | Indicates when the form is being validated                                   |
| submitCount   | `number`   | Count the number of time the form has been submitted                         |
| touchedFields | `string[]` | List of fields the user has interacted with (focus + blur)                   |

All states except `isReady` reset to initial values when the form is reset.

## Usage

import SimpleHookUseFormStates from '@site/src/demo/SimpleHookUseFormStates';
import SimpleHookUseFormStatesSource from '!!raw-loader!@site/src/demo/SimpleHookUseFormStates';
import SimpleComponentUseFormStates from '@site/src/demo/SimpleComponentUseFormStates';
import SimpleComponentUseFormStatesSource from '!!raw-loader!@site/src/demo/SimpleComponentUseFormStates';

<DemoTabs Component={SimpleComponentUseFormStates} Hook={SimpleHookUseFormStates} componentCode={SimpleComponentUseFormStatesSource} componentMetastring="{20,24,29,41,58}" hookCode={SimpleHookUseFormStatesSource} hookMetastring="{21,25,30,50,60}" withModes withRevalidateModes />
