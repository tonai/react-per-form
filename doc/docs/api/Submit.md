# `<Submit>`

The `<Submit>` component is a shortcut for an `<input type="submit" />` element.

The `disableOnError` props needs the context to be set.

## Props

`<Submit>` takes the following props:

| Property       | Type        | Default | Description                                          |
| -------------- | ----------- | ------- | ---------------------------------------------------- |
| disableOnError | `boolean`   |         | Disable the submit button when the form is not valid |
| ...rest        | `unknown[]` |         | All props are forwarded to the `<input>` element     |

## Usage

import SimpleHookSubmitComponent from '@site/src/demo/SimpleHookSubmitComponent';
import SimpleHookSubmitComponentSource from '!!raw-loader!@site/src/demo/SimpleHookSubmitComponent';
import SimpleComponentSubmitComponent from '@site/src/demo/SimpleComponentSubmitComponent';
import SimpleComponentSubmitComponentSource from '!!raw-loader!@site/src/demo/SimpleComponentSubmitComponent';

<DemoTabs Component={SimpleComponentSubmitComponent} Hook={SimpleHookSubmitComponent} componentCode={SimpleComponentSubmitComponentSource} componentMetastring="{21}" hookCode={SimpleHookSubmitComponentSource} hookMetastring="{26}" withModes withRevalidateModes />
