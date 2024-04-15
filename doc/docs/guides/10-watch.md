# Watch

You can use the watch methods to kind of replace controlled component (or do anything you want with the values you get).

Compared to controlled component, using watch, you won't need to reset the state using the `onReset` parameter for example (check the [controlled component example](/docs/guides/controlled-components#simple-controlled-component)).

:::warning

Watch is only getting the value when the user changes it.

It is not a two way data binding like with controlled components.

:::

## With the `useWatch` hook

You can use the `useWatch` hook to declare a state that will contains the values of the watched fields.

The `useWatch` take only one optional parameter to define the list of field names you want to watch (you can provide a string an array of string or nothing to watch all values).

import SimpleHookUseWatch from '@site/src/demo/SimpleHookUseWatch';
import SimpleHookUseWatchSource from '!!raw-loader!@site/src/demo/SimpleHookUseWatch';
import SimpleComponentUseWatch from '@site/src/demo/SimpleComponentUseWatch';
import SimpleComponentUseWatchSource from '!!raw-loader!@site/src/demo/SimpleComponentUseWatch';

<DemoTabs Component={SimpleComponentUseWatch} Hook={SimpleHookUseWatch} componentCode={SimpleComponentUseWatchSource} componentMetastring="{12,17}" hookCode={SimpleHookUseWatchSource} hookMetastring="{13,18,29,35,43}" withModes withRevalidateModes />

:::warning

With the hook version you will have to add yourself the react-swift-form `<FormProvider>` component !

:::

## With the `watch` function

You can get the `watch` function from the useForm hook or with the context.

The `watch` accept two parameters:

1. The watch callback, fired when the values change.
2. The list of field names you want tp watch (you can provide a string an array of string or nothing to watch all values).

import SimpleHookWatch from '@site/src/demo/SimpleHookWatch';
import SimpleHookWatchSource from '!!raw-loader!@site/src/demo/SimpleHookWatch';
import SimpleComponentWatch from '@site/src/demo/SimpleComponentWatch';
import SimpleComponentWatchSource from '!!raw-loader!@site/src/demo/SimpleComponentWatch';

<DemoTabs Component={SimpleComponentWatch} Hook={SimpleHookWatch} componentCode={SimpleComponentWatchSource} componentMetastring="{6,8-11,17}" hookCode={SimpleHookWatchSource} hookMetastring="{11,16-19,25}" withModes withRevalidateModes />

:::note

In that case you have to define the state yourself (if you want to).

:::

:::info

The `watch` function return a function for unsubscribing the watch. You can directly return that function in your `useEffect`.

:::
