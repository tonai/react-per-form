---
sidebar_position: 1
---

# Getting started

## Installation

First install the package with:

```bash
# npm
npm install react-hook-form
# yarn
yarn add react-hook-form
# pnpm
pnpm install react-hook-form
```

## Usage

react-swift-form can be used with two main flavors:

### Using the `useForm` hook

Use the `useForm` hook combined with a native HTML `<form>` component:

import SimpleHook from '@site/src/demo/SimpleHook';
import SimpleHookSource from '!!raw-loader!@site/src/demo/SimpleHook';

<Demo Component={SimpleHook} content={SimpleHookSource}/>

Easy isn't it ?

### Using the `<Form>` component

Use the `<Form>` component like the native HTML `<form>` component:

import SimpleComponent from '@site/src/demo/SimpleComponent';
import SimpleComponentSource from '!!raw-loader!@site/src/demo/SimpleComponent';

<Demo Component={SimpleComponent} content={SimpleComponentSource}/>

And that's it !

:::info

In both case there is no need to register the form fields, you only need to add a `name` attribute !

:::

## Customize error display

By default react-swift-form use native form validation to avoid using any state.

But if you want to customize the display of form errors you can turn off the native validation with the `useNativeValidation` parameter.

import SimpleHookNonNative from '@site/src/demo/SimpleHookNonNative';
import SimpleHookNonNativeSource from '!!raw-loader!@site/src/demo/SimpleHookNonNative';

<Demo Component={SimpleHookNonNative} content={SimpleHookNonNativeSource}/>

In that case you will have access to an `errors` state that contains field errors you can use as you want.
