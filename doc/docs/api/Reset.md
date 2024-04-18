# `<Reset>`

The `<Reset>` component is a shortcut for an `<input type="reset" />` element.

## Props

`<Reset>` takes the following props:

| Property | Type        | Default | Description                                      |
| -------- | ----------- | ------- | ------------------------------------------------ |
| ...rest  | `unknown[]` |         | All props are forwarded to the `<input>` element |

## Usage

import SimpleHookResetComponent from '@site/src/demo/SimpleHookResetComponent';
import SimpleHookResetComponentSource from '!!raw-loader!@site/src/demo/SimpleHookResetComponent';
import SimpleComponentResetComponent from '@site/src/demo/SimpleComponentResetComponent';
import SimpleComponentResetComponentSource from '!!raw-loader!@site/src/demo/SimpleComponentResetComponent';

<DemoTabs Component={SimpleComponentResetComponent} Hook={SimpleHookResetComponent} componentCode={SimpleComponentResetComponentSource} componentMetastring="{23}" hookCode={SimpleHookResetComponentSource} hookMetastring="{21}" withModes withRevalidateModes />
