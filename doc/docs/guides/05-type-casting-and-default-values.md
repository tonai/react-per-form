# Type casting and default values

## Type casting with the `transformers` parameter

When you retrieve the values from for fields, by default you always get a `string` (and a `boolean` for the `checked` property of a checkbox).

But sometimes it can be handy to cast the `string` value to something that can be more appropriate for you case, and in that case you can use the `transformers` parameter:

import SimpleHookTransformers from '@site/src/demo/SimpleHookTransformers';
import SimpleHookTransformersSource from '!!raw-loader!@site/src/demo/SimpleHookTransformers';
import SimpleComponentTransformers from '@site/src/demo/SimpleComponentTransformers';
import SimpleComponentTransformersSource from '!!raw-loader!@site/src/demo/SimpleComponentTransformers';

<DemoTabs Component={SimpleComponentTransformers} Hook={SimpleHookTransformers} componentCode={SimpleComponentTransformersSource} componentMetastring="{5,13}" hookCode={SimpleHookTransformersSource} hookMetastring="{5,15}" withModes withRevalidateModes />

The transformer function ges the value to cast as parameter and should return the casted value.

:::note

There is no quotes around the logged value when you submit the form.

:::

## Default values

### With the `defaultValue` props

If you want to have default value for your form you can simply use the `defaultValue` props on the input (`defaultChecked` for checkbox and radio buttons):

import SimpleHookDefaultValue from '@site/src/demo/SimpleHookDefaultValue';
import SimpleHookDefaultValueSource from '!!raw-loader!@site/src/demo/SimpleHookDefaultValue';
import SimpleComponentDefaultValue from '@site/src/demo/SimpleComponentDefaultValue';
import SimpleComponentDefaultValueSource from '!!raw-loader!@site/src/demo/SimpleComponentDefaultValue';

<DemoTabs Component={SimpleComponentDefaultValue} Hook={SimpleHookDefaultValue} componentCode={SimpleComponentDefaultValueSource} componentMetastring="{14}" hookCode={SimpleHookDefaultValueSource} hookMetastring="{17}" withModes withRevalidateModes />

### With the `defaultValues` parameter

Or you can use the `defaultValues` parameter:

import SimpleHookDefaultValues from '@site/src/demo/SimpleHookDefaultValues';
import SimpleHookDefaultValuesSource from '!!raw-loader!@site/src/demo/SimpleHookDefaultValues';
import SimpleComponentDefaultValues from '@site/src/demo/SimpleComponentDefaultValues';
import SimpleComponentDefaultValuesSource from '!!raw-loader!@site/src/demo/SimpleComponentDefaultValues';

<DemoTabs Component={SimpleComponentDefaultValues} Hook={SimpleHookDefaultValues} componentCode={SimpleComponentDefaultValuesSource} componentMetastring="{5,13}" hookCode={SimpleHookDefaultValuesSource} hookMetastring="{5,14}" withModes withRevalidateModes />

:::warning

Declare the default values outside the component to avoid creating a new reference for each new render.

If you don't react-swift-form will update the form values with the default ones on the next render.

If you can't declare them outside, then use `useMemo`.

:::

:::note

Even if we give `defaultValues` a number, the logged value is a string.

Indeed, `defaultValues` is only responsible for initializing the values in the fields.

If you want to convert the value, use the `transformers` parameter like in the example below.

:::

### With type casting

If you want to use type casting and have default values, simply combine both:

1. `defaultValue` or `defaultValues` to provide the default values in the field
2. `transformers` parameter to cast the value

import SimpleHookTransformersDefaultValues from '@site/src/demo/SimpleHookTransformersDefaultValues';
import SimpleHookTransformersDefaultValuesSource from '!!raw-loader!@site/src/demo/SimpleHookTransformersDefaultValues';
import SimpleComponentTransformersDefaultValues from '@site/src/demo/SimpleComponentTransformersDefaultValues';
import SimpleComponentTransformersDefaultValuesSource from '!!raw-loader!@site/src/demo/SimpleComponentTransformersDefaultValues';

<DemoTabs Component={SimpleComponentTransformersDefaultValues} Hook={SimpleHookTransformersDefaultValues} componentCode={SimpleComponentTransformersDefaultValuesSource} componentMetastring="{5,6,16,18}" hookCode={SimpleHookTransformersDefaultValuesSource} hookMetastring="{5,6,15,17}" withModes withRevalidateModes />

### Loading default values asynchronously

In this example imagine that the `useData` hook loads some data over the network and then returns the value asynchronously (for the example we simply update the state after 1 second with `"Asynchronous value"`).

import SimpleHookDefaultValuesAsync from '@site/src/demo/SimpleHookDefaultValuesAsync';
import SimpleHookDefaultValuesAsyncSource from '!!raw-loader!@site/src/demo/SimpleHookDefaultValuesAsync';
import SimpleComponentDefaultValuesAsync from '@site/src/demo/SimpleComponentDefaultValuesAsync';
import SimpleComponentDefaultValuesAsyncSource from '!!raw-loader!@site/src/demo/SimpleComponentDefaultValuesAsync';

<DemoTabs Component={SimpleComponentDefaultValuesAsync} Hook={SimpleHookDefaultValuesAsync} componentCode={SimpleComponentDefaultValuesAsyncSource} componentMetastring="{7,17}" hookCode={SimpleHookDefaultValuesAsyncSource} hookMetastring="{7,20}" withModes withRevalidateModes />

:::tip

Change the form options (useNativeValidation, mode or revalidateMode) to reinitialize the form and see the update again.

:::

:::note

We can also use the `defaultValues` parameters but in that case it is necessary to use `useMemo`:

```ts
const defaultValues = useMemo(() => ({ text: data }), [data]);
```

:::
