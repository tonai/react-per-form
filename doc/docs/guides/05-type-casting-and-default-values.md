# Type casting and default values

## Using the `onChange` handler

When you retrieve the values from for fields, by default you always get a `string` (and a `boolean` for the `checked` property of a checkbox).

But sometimes it can be handy to cast to the `string` value to something that can be more appropriate for you case, and in that case you can use the `transformer` propery of the `onChange` handler:

import SimpleHookOnChange from '@site/src/demo/SimpleHookOnChange';
import SimpleHookOnChangeSource from '!!raw-loader!@site/src/demo/SimpleHookOnChange';
import SimpleComponentOnChange from '@site/src/demo/SimpleComponentOnChange';
import SimpleComponentOnChangeSource from '!!raw-loader!@site/src/demo/SimpleComponentOnChange';

<DemoTabs Component={SimpleComponentOnChange} Hook={SimpleHookOnChange} componentCode={SimpleComponentOnChangeSource} componentMetastring="{13,17}" hookCode={SimpleHookOnChangeSource} hookMetastring="{11,20}" withModes withRevalidateModes />

The transformer function ges the value to cast as parameter and should return the casted value.

:::note

There is no quotes around the logged value when you submit the form.

:::

## Default values

### Without type casting

If you want to have default value for your form you can simply use the `defaultValue` props on the input (`defaultChecked` for checkbox and radio buttons):

import SimpleHookDefaultValues from '@site/src/demo/SimpleHookDefaultValues';
import SimpleHookDefaultValuesSource from '!!raw-loader!@site/src/demo/SimpleHookDefaultValues';
import SimpleComponentDefaultValues from '@site/src/demo/SimpleComponentDefaultValues';
import SimpleComponentDefaultValuesSource from '!!raw-loader!@site/src/demo/SimpleComponentDefaultValues';

<DemoTabs Component={SimpleComponentDefaultValues} Hook={SimpleHookDefaultValues} componentCode={SimpleComponentDefaultValuesSource} componentMetastring="{15}" hookCode={SimpleHookDefaultValuesSource} hookMetastring="{18}" withModes withRevalidateModes />

### With type casting

If you want to use type casting and have default values, using the `defaultValue` props on the input won't be enough (the value will still be a string and won't get cast until you change the value).

In that case you can use `defaultValues` to provide the default values of the form:

import SimpleHookOnChangeDefaultValues from '@site/src/demo/SimpleHookOnChangeDefaultValues';
import SimpleHookOnChangeDefaultValuesSource from '!!raw-loader!@site/src/demo/SimpleHookOnChangeDefaultValues';
import SimpleComponentOnChangeDefaultValues from '@site/src/demo/SimpleComponentOnChangeDefaultValues';
import SimpleComponentOnChangeDefaultValuesSource from '!!raw-loader!@site/src/demo/SimpleComponentOnChangeDefaultValues';

<DemoTabs Component={SimpleComponentOnChangeDefaultValues} Hook={SimpleHookOnChangeDefaultValues} componentCode={SimpleComponentOnChangeDefaultValuesSource} componentMetastring="{5,14,19}" hookCode={SimpleHookOnChangeDefaultValuesSource} hookMetastring="{5,15,23}" withModes withRevalidateModes />

:::info

If possible declare the default values outside the component to avoid creating a new reference for each new render.

:::

:::note

In that case, resetting the form will effectively reset the values using `defaultValues`.

:::
