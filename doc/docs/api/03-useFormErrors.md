# `useFormErrors`

`useFormErrors` is a shortcut to only get the errors from the form context.

## Parameters

There is no parameters for `useFormErrors`.

## Returns

`useFormErrors` directly return the error object (type `IError`).

See [here](/docs/api/types) for the types.

## Usage

import SimpleHookUseFormErrors from '@site/src/demo/SimpleHookUseFormErrors';
import SimpleHookUseFormErrorsSource from '!!raw-loader!@site/src/demo/SimpleHookUseFormErrors';
import SimpleComponentUseFormErrors from '@site/src/demo/SimpleComponentUseFormErrors';
import SimpleComponentUseFormErrorsSource from '!!raw-loader!@site/src/demo/SimpleComponentUseFormErrors';

<DemoTabs Component={SimpleComponentUseFormErrors} Hook={SimpleHookUseFormErrors} componentCode={SimpleComponentUseFormErrorsSource} componentMetastring="{6,22,25}" hookCode={SimpleHookUseFormErrorsSource} hookMetastring="{7,28,33}" withModes withRevalidateModes />
