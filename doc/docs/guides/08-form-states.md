# Form states

## react-per-form `states` values

react-per-form expose a `states` object that contains form states:

- changedFields (`string[]`): List of fields the user has changed
- dirtyFields (`string[]`): List of fields the user has changed and values are different to default ones
- isDirty (`boolean`): Whether the form is dirty or not (at least one field is dirty)
- isPristine (`boolean`): Inverse of `isDirty`
- isReady (`boolean`): Indicates when the form is ready
- isSubmitted (`boolean`): `true` when the form has been submitted at least once
- isSubmitting (`boolean`): Indicates when the form is being submitted
- isValid (`boolean`): Whether the form is valid or not
- isValidating (`boolean`): Indicates when the form is being validated
- submitCount (`number`): Count the number of time the form has been submitted
- touchedFields (`string[]`): List of fields the user has interacted with (focus + blur)

:::warning

The `states` object is not a React state so you should not use it directly in your renders !

:::

This example will not work has expected:

import SimpleHookBadStates from '@site/src/demo/SimpleHookBadStates';
import SimpleHookBadStatesSource from '!!raw-loader!@site/src/demo/SimpleHookBadStates';
import SimpleComponentBadStates from '@site/src/demo/SimpleComponentBadStates';
import SimpleComponentBadStatesSource from '!!raw-loader!@site/src/demo/SimpleComponentBadStates';

<DemoTabs Component={SimpleComponentBadStates} Hook={SimpleHookBadStates} componentCode={SimpleComponentBadStatesSource} componentMetastring="{12,16}" hookCode={SimpleHookBadStatesSource} hookMetastring="{10,19}" />

:::info

The button stay disabled even when you fill the input because by default react-per-form do not trigger unwanted renders.

See below on how to retrieve the form state correctly.

:::

## With the `Submit` button

The previous example, where the `<submit>` button is disabled while the form is invalid can be created by using the `<Submit>` component with the `disableOnError` props:

import SimpleHookSubmitComponent from '@site/src/demo/SimpleHookSubmitComponent';
import SimpleHookSubmitComponentSource from '!!raw-loader!@site/src/demo/SimpleHookSubmitComponent';
import SimpleComponentSubmitComponent from '@site/src/demo/SimpleComponentSubmitComponent';
import SimpleComponentSubmitComponentSource from '!!raw-loader!@site/src/demo/SimpleComponentSubmitComponent';

<DemoTabs Component={SimpleComponentSubmitComponent} Hook={SimpleHookSubmitComponent} componentCode={SimpleComponentSubmitComponentSource} componentMetastring="{21}" hookCode={SimpleHookSubmitComponentSource} hookMetastring="{26}" withModes withRevalidateModes />

## With the `useFormValid` hook

More generic than the previous case but still dedicated to the valid state, you can use the `useFormValid` hook to get the form valid state as a real React state:

import SimpleHookUseFormValid from '@site/src/demo/SimpleHookUseFormValid';
import SimpleHookUseFormValidSource from '!!raw-loader!@site/src/demo/SimpleHookUseFormValid';
import SimpleComponentUseFormValid from '@site/src/demo/SimpleComponentUseFormValid';
import SimpleComponentUseFormValidSource from '!!raw-loader!@site/src/demo/SimpleComponentUseFormValid';

<DemoTabs Component={SimpleComponentUseFormValid} Hook={SimpleHookUseFormValid} componentCode={SimpleComponentUseFormValidSource} componentMetastring="{6,20,28}" hookCode={SimpleHookUseFormValidSource} hookMetastring="{7,27,33}" withModes withRevalidateModes />

:::warning

With the hook version you will have to add yourself the react-per-form `<FormProvider>` component !

:::

## With the `useFormStates` hook

The `useFormStates` hook will return you all form state as a real React state:

import SimpleHookUseFormStates from '@site/src/demo/SimpleHookUseFormStates';
import SimpleHookUseFormStatesSource from '!!raw-loader!@site/src/demo/SimpleHookUseFormStates';
import SimpleComponentUseFormStates from '@site/src/demo/SimpleComponentUseFormStates';
import SimpleComponentUseFormStatesSource from '!!raw-loader!@site/src/demo/SimpleComponentUseFormStates';

<DemoTabs Component={SimpleComponentUseFormStates} Hook={SimpleHookUseFormStates} componentCode={SimpleComponentUseFormStatesSource} componentMetastring="{6,20,24,29,43,47}" hookCode={SimpleHookUseFormStatesSource} hookMetastring="{7,21,25,30,43,54}" withModes withRevalidateModes />

:::info

`isDirty`, `isPristine` and `dirtyFields` compare field values to `defaultValues` (`a` field) or `defaultValue` (`b` field) or to empty string `""` (`c` field) to define their states.

:::

:::note

You can pass a field name to `useFormStates` to get the field state instead of the whole form state.

:::

## With the `useSubscribe` hook

You can use the `useSubscribe` hook to listen to state changes.

You can then provide a callback that will for example update a state:

import SimpleHookUseSubscribe from '@site/src/demo/SimpleHookUseSubscribe';
import SimpleHookUseSubscribeSource from '!!raw-loader!@site/src/demo/SimpleHookUseSubscribe';
import SimpleComponentUseSubscribe from '@site/src/demo/SimpleComponentUseSubscribe';
import SimpleComponentUseSubscribeSource from '!!raw-loader!@site/src/demo/SimpleComponentUseSubscribe';

<DemoTabs Component={SimpleComponentUseSubscribe} Hook={SimpleHookUseSubscribe} componentCode={SimpleComponentUseSubscribeSource} componentMetastring="{11,12,15}" hookCode={SimpleHookUseSubscribeSource} hookMetastring="{11,12,15}" withModes withRevalidateModes />

:::warning

Again, with the hook version you will have to add yourself the provider.

:::

## With the `subscribe` function

You can subscribe to state changes with the `subscribe` function.

In that case you need to declare both the `useState` and the `useEffect` yourself:

import SimpleHookSubscribe from '@site/src/demo/SimpleHookSubscribe';
import SimpleHookSubscribeSource from '!!raw-loader!@site/src/demo/SimpleHookSubscribe';
import SimpleComponentSubscribe from '@site/src/demo/SimpleComponentSubscribe';
import SimpleComponentSubscribeSource from '!!raw-loader!@site/src/demo/SimpleComponentSubscribe';

<DemoTabs Component={SimpleComponentSubscribe} Hook={SimpleHookSubscribe} componentCode={SimpleComponentSubscribeSource} componentMetastring="{11,13-16,19}" hookCode={SimpleHookSubscribeSource} hookMetastring="{10,15-18,24}" withModes withRevalidateModes />

:::info

The `subscribe` function return a function for unsubscribing. You can directly return that function in your `useEffect`.

:::

## With disabled inputs

Form validation is working as expected even with dynamic disabled inputs:

import SimpleHookDisabled from '@site/src/demo/SimpleHookDisabled';
import SimpleHookDisabledSource from '!!raw-loader!@site/src/demo/SimpleHookDisabled';
import SimpleComponentDisabled from '@site/src/demo/SimpleComponentDisabled';
import SimpleComponentDisabledSource from '!!raw-loader!@site/src/demo/SimpleComponentDisabled';

<DemoTabs Component={SimpleComponentDisabled} Hook={SimpleHookDisabled} componentCode={SimpleComponentDisabledSource} componentMetastring="{15,18,30}" hookCode={SimpleHookDisabledSource} hookMetastring="{16,19,36}" withModes withRevalidateModes />

:::info

The submit button is disabled when the input field is empty.

But the submit button is then enabled when the field is disabled even if the field is still empty.

:::
