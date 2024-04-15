# `useWatch`

`useWatch` return a React state for the values of the field being watched.

## Parameters

`useWatch` take the name of the fields to watch:

- it can be a string for a single field
- it can be an array a string for multiple fields
- if nothing is passed then all fields are watched

## Returns

`useWatch` return the values as React state.

## Usage

import SimpleHookUseWatch from '@site/src/demo/SimpleHookUseWatch';
import SimpleHookUseWatchSource from '!!raw-loader!@site/src/demo/SimpleHookUseWatch';
import SimpleComponentUseWatch from '@site/src/demo/SimpleComponentUseWatch';
import SimpleComponentUseWatchSource from '!!raw-loader!@site/src/demo/SimpleComponentUseWatch';

<DemoTabs Component={SimpleComponentUseWatch} Hook={SimpleHookUseWatch} componentCode={SimpleComponentUseWatchSource} componentMetastring="{12,29,35}" hookCode={SimpleHookUseWatchSource} hookMetastring="{13,35,43}" withModes withRevalidateModes />
