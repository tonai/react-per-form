# Messages and i18n

## Custom error messages

You can send the error message you want with validators or manual errors but the browser is responsible for native errors.

The good thing is that they are already translated in the user language but sometimes you want to customize those error or just want the translation them to match the language chosen in your website.

In that case you can customize error messages using the `messages` parameter:

import SimpleHookMessages from '@site/src/demo/SimpleHookMessages';
import SimpleHookMessagesSource from '!!raw-loader!@site/src/demo/SimpleHookMessages';
import SimpleComponentMessages from '@site/src/demo/SimpleComponentMessages';
import SimpleComponentMessagesSource from '!!raw-loader!@site/src/demo/SimpleComponentMessages';

<DemoTabs Component={SimpleComponentMessages} Hook={SimpleHookMessages} componentCode={SimpleComponentMessagesSource} componentMetastring="{5,15}" hookCode={SimpleHookMessagesSource} hookMetastring="{5,15}" withModes withRevalidateModes />

## Error keys

When using the `messages` parameter you will have to use the following keys in your object:

1. For validators, use the same string as the ones returned from your validators.
2. Same for manual errors.
3. For native errors, use [`ValidityState` keys](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState):
   - `badInput`: if the user has provided input that the browser is unable to convert.
   - `patternMismatch`: if the value does not match the specified `pattern` attribute.
   - `rangeOverflow`: if the value is greater than the maximum specified by the `max` attribute.
   - `rangeUnderflow`: if the value is less than the minimum specified by the `min` attribute.
   - `stepMismatch`: if the value does not fit the rules determined by the `step` attribute.
   - `tooLong`: if the value exceeds the specified `maxlength` attribute.
   - `tooShort`: if the value fails to meet the specified `minlength` attribute.
   - `typeMismatch`: if the value is not in the required syntax (when type is `email` or `url`).
   - `valueMissing`: if the element has a `required` attribute.

import HookErrorMessages from '@site/src/demo/HookErrorMessages';
import HookErrorMessagesSource from '!!raw-loader!@site/src/demo/HookErrorMessages';
import ComponentErrorMessages from '@site/src/demo/ComponentErrorMessages';
import ComponentErrorMessagesSource from '!!raw-loader!@site/src/demo/ComponentErrorMessages';

<DemoTabs Component={ComponentErrorMessages} Hook={HookErrorMessages} componentCode={ComponentErrorMessagesSource} componentMetastring="{15-19,37}" hookCode={HookErrorMessagesSource} hookMetastring="{15-19,36}" withModes withRevalidateModes />

:::tip

By using this technique you centralize all translations in one place which is more convenient for i18n.

:::

## Local custom messages

You can also provide local custom messages using the `useInput` or `useInputs` hooks:

import LocalValidationHookMessages from '@site/src/demo/LocalValidationHookMessages';
import LocalValidationHookMessagesSource from '!!raw-loader!@site/src/demo/LocalValidationHookMessages';
import LocalValidationComponentMessages from '@site/src/demo/LocalValidationComponentMessages';
import LocalValidationComponentMessagesSource from '!!raw-loader!@site/src/demo/LocalValidationComponentMessages';

<DemoTabs Component={LocalValidationComponentMessages} Hook={LocalValidationHookMessages} componentCode={LocalValidationComponentMessagesSource} componentMetastring="{8,9,13,33}" hookCode={LocalValidationHookMessagesSource} hookMetastring="{9,10,14,33}" withModes withRevalidateModes />

:::tip

Global messages are also available for locally declared fields, but local messages will only apply to associated fields.

If global and local keys conflict, local messages will take precedence over global messages.

:::
