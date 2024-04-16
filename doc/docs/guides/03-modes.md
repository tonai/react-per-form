# Modes

## Validation strategy

react-swift-mode propose multiple validation strategy with the `mode` parameter:

- `"submit"` (default): Validation is only triggered when the form is submitted.
- `"blur"`: Validation is triggered when fields lose focus (in addition to the form being submitted).
- `"change"`: Validation is triggered when field values change (in addition to the form being submitted).
- `"all"`: Validation is triggered for all above cases.

Here you can test the different modes :

import SimpleHookProps from '@site/src/demo/SimpleHookProps';
import SimpleHookPropsSource from '!!raw-loader!@site/src/demo/SimpleHookProps';
import SimpleComponentProps from '@site/src/demo/SimpleComponentProps';
import SimpleComponentPropsSource from '!!raw-loader!@site/src/demo/SimpleComponentProps';

<DemoTabs Component={SimpleComponentProps} Hook={SimpleHookProps} componentCode={SimpleComponentPropsSource} componentMetastring="{11}" hookCode={SimpleHookPropsSource} hookMetastring="{11}" withModes />

:::warning

`mode="blur"` or `mode="all"` does not work well with native validation, as native validation will set the focus in the field when the validation is triggered.

In that case the won't be able to remove focus from the field unless you fix the error.

:::

## Re-validation strategy

The re-validation strategy is the way you want the validation to be triggered when you are fixing an error.

You can use the `revalidateMode` parameter for that:

- `"submit"` (default): Re-validation is only triggered when the form is submitted.
- `"blur"`: Re-validation is triggered when fields lose focus (in addition to the form being submitted).
- `"change"`: Re-validation is triggered when field values change (in addition to the form being submitted).

Here you can test the different revalidate modes :

<DemoTabs Component={SimpleComponentProps} Hook={SimpleHookProps} componentCode={SimpleComponentPropsSource} componentMetastring="{11}" hookCode={SimpleHookPropsSource} hookMetastring="{11}" withModes withRevalidateModes />

:::warning

Again `revalidateMode="blur"` does not work well with native validation for the same reason as `mode`.

:::
