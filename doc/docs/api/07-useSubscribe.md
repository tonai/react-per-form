# `useSubscribe`

Basic subscription you can use to be notified when form state changes or when the value of a field changes.

## Parameters

`useSubscribe` take two parameter:

1. the callback function. This function will receive an object as parameter containing the following keys:
   - `form`: form reference
   - `names`: the optional `names` given as second parameter
   - `prevValues`: previous values of the fields
   - `states`: form states
   - `values`: current values of the fields
2. an optional array of string (or a single string) used to filter the `values` and `prevValues` from the callback parameter. When you provide some names, subscription will only be triggered when one of the listed field values changes

## Returns

`useSubscribe` does not return anything.

## Usage

import SimpleHookUseSubscribe from '@site/src/demo/SimpleHookUseSubscribe';
import SimpleHookUseSubscribeSource from '!!raw-loader!@site/src/demo/SimpleHookUseSubscribe';
import SimpleComponentUseSubscribe from '@site/src/demo/SimpleComponentUseSubscribe';
import SimpleComponentUseSubscribeSource from '!!raw-loader!@site/src/demo/SimpleComponentUseSubscribe';

<DemoTabs Component={SimpleComponentUseSubscribe} Hook={SimpleHookUseSubscribe} componentCode={SimpleComponentUseSubscribeSource} componentMetastring="{11,12,15,28,36}" hookCode={SimpleHookUseSubscribeSource} hookMetastring="{11,12,15,34,40}" withModes withRevalidateModes />
