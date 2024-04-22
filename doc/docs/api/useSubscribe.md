# `useSubscribe`

Basic subscription you can use to be notified when form state changes.

## Parameters

`useSubscribe` takes only one parameter, the callback function that will receive the form states as parameter.

## Returns

`useSubscribe` does not return anything.

## Usage

import SimpleHookUseSubscribe from '@site/src/demo/SimpleHookUseSubscribe';
import SimpleHookUseSubscribeSource from '!!raw-loader!@site/src/demo/SimpleHookUseSubscribe';
import SimpleComponentUseSubscribe from '@site/src/demo/SimpleComponentUseSubscribe';
import SimpleComponentUseSubscribeSource from '!!raw-loader!@site/src/demo/SimpleComponentUseSubscribe';

<DemoTabs Component={SimpleComponentUseSubscribe} Hook={SimpleHookUseSubscribe} componentCode={SimpleComponentUseSubscribeSource} componentMetastring="{11,12,15,27,35}" hookCode={SimpleHookUseSubscribeSource} hookMetastring="{11,12,15,33,39}" withModes withRevalidateModes />
