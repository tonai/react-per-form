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

### With the `useForm` hook

Use the `useForm` hook combined with a native HTML `<form>` component:

import SimpleHook from '@site/src/demo/SimpleHook';
import SimpleHookSource from '!!raw-loader!@site/src/demo/SimpleHook';

<Demo Component={SimpleHook} code={SimpleHookSource}/>

Easy isn't it ?

:::tip

You want the input to be at least 3 characters ?

Then just add `minlength="3"` as you would do in classic HTML and it's done.

All native HTML validations are supported out of the box !

:::

### With the `<Form>` component

Use the `<Form>` component like the native HTML `<form>` component:

import SimpleComponent from '@site/src/demo/SimpleComponent';
import SimpleComponentSource from '!!raw-loader!@site/src/demo/SimpleComponent';

<Demo Component={SimpleComponent} code={SimpleComponentSource}/>

And that's it !

:::info

For both cases there is no need to register the form fields, you only need to add a `name` attribute !

:::

## Customize error display

By default react-swift-form use native form validation, but you can also choose to customize the error as you want by setting `useNativeValidation: false` and display the error as you want :

import SimpleHookNonNative from '@site/src/demo/SimpleHookNonNative';
import SimpleHookNonNativeSource from '!!raw-loader!@site/src/demo/SimpleHookNonNative';

<Demo Component={SimpleHookNonNative} code={SimpleHookNonNativeSource} metastring="{12,18}" />

Check the [guide page about errors](/docs/guides/errors) for more information.
