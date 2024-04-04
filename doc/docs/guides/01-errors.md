# Errors

By default react-swift-form use native form validation to avoid using any state at all (for performance reason).

But if you want to customize the display of form errors you can turn off the native validation with the `useNativeValidation` parameter.

## With the `useForm` hook

You can directly access the error object from the `useForm` hook:

import SimpleHookNonNative from '@site/src/demo/SimpleHookNonNative';
import SimpleHookNonNativeSource from '!!raw-loader!@site/src/demo/SimpleHookNonNative';

<Demo Component={SimpleHookNonNative} content={SimpleHookNonNativeSource}/>

## With the `<Form>` component

### Render prop method

You can access the error object using the children of the `<Form>` component as a render prop:

import SimpleComponentNonNativeRender from '@site/src/demo/SimpleComponentNonNativeRender';
import SimpleComponentNonNativeRenderSource from '!!raw-loader!@site/src/demo/SimpleComponentNonNativeRender';

<Demo Component={SimpleComponentNonNativeRender} content={SimpleComponentNonNativeRenderSource}/>

### Context method

Or you can access the error object using the context (in that case you need to use a sub-component).

You can use the `useFormErrors` hook to directly get access to the errors:

import SimpleComponentNonNativeContext from '@site/src/demo/SimpleComponentNonNativeContext';
import SimpleComponentNonNativeContextSource from '!!raw-loader!@site/src/demo/SimpleComponentNonNativeContext';

<Demo Component={SimpleComponentNonNativeContext} content={SimpleComponentNonNativeContextSource}/>

## The error object

Inside the error object you can access all errors classified in different categories.

It has the following shape:

| Property  | Type                                                               | Description                                                                                                                                                                            |
| --------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| native    | `Record<string, string>`                                           | Contains errors only relative to native validation (`required`, `min`, `maxlength`, `pattern`...etc.). Keys are field names and values are error strings (empty string means no error) |
| validator | `Record<string, {error: string, global: boolean, names: string[]>` | Contains error only relative to custom field validation (See [guide page about validation](/docs/guides/validation) for more information). Keys are validator id                       |
| manual    | `Record<string, string \| null>`                                   | Contains error only relative to manual validation (See [guide page about validation](/docs/guides/validation) for more information). Keys are field names                              |
| global    | `Record<string, {error: string, global: boolean, names: string[]>` | Contains error only relative to global form validation (See [guide page about validation](/docs/guides/validation) for more information). Keys are validator id                        |
| all       | `Record<string, string>`                                           | Contains all above errors, with one error per field (native errors first, then manual errors, then validator errors). Keys are field names                                             |
| main      | `{error: string, global: boolean, id: string, names: string[] }`   | Contain the first error from top to bottom fields.                                                                                                                                     |

<!-- TODO add example with all errors displayed -->
