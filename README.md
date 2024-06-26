# @per-form/react

<p align="center">
  <img alt="@per-form/react Logo" src="/doc/static/img/logo.svg#gh-light-mode-only" width="200" />
  <img alt="@per-form/react Logo" src="/doc/static/img/logo-dark.svg#gh-dark-mode-only" width="200" />
</p>
<p align="center">
  Fast and easy form validation for React based on native HTML capabilities
</p>
<p align="center">
  <a href="https://tonai.github.io/react-per-form/" target="_blank">Documentation</a>
</p>
<div align="center">

<!-- [![NPM Downloads](https://img.shields.io/npm/dm/@per-form/react?style=flat)](https://www.npmjs.com/package/@per-form/react) -->

[![NPM Version](https://img.shields.io/npm/v/@per-form/react)](https://www.npmjs.com/package/@per-form/react)
[![GitHub License](https://img.shields.io/github/license/tonai/react-per-form)](https://github.com/tonai/react-per-form/blob/main/LICENSE)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@per-form/react)](https://bundlephobia.com/package/@per-form/react)

<!-- [![GitHub Repo stars](https://img.shields.io/github/stars/tonai/react-per-form)](https://github.com/tonai/react-per-form/blob/main/LICENSE) -->

</div>

## Features

- ☯ Very easy to use
- 🚀 Really fast
- 🏋 Extra small bundle size
- 🤯 Can works without any state
- 💅 Native and customizable errors
- 👯 Multiple validation modes
- 📑 Custom validation with
  - 🎉 Cross inputs validation
  - 😎 Async validation
  - 🔥 Support dynamic form
- 💬 Custom messages / translations
- 💯 Fully tested
- 📚 Support controlled components and UI libraries
- ⚡️ Compatible with Next.js server actions
- 👀 Watch values
- 💪 And much more...

## Install

```bash
# npm
npm install @per-form/react
# yarn
yarn add @per-form/react
# pnpm
pnpm install @per-form/react
```

## Usage

### With hook

```tsx
import type { FormEvent } from 'react';
import { type IFormValues, useForm } from '@per-form/react';

export default function Demo() {
  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  const { formProps } = useForm({
    onSubmit: handleSubmit,
  });

  return (
    <form {...formProps}>
      <input name="text" required />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Or with component

```tsx
import type { FormEvent } from 'react';
import { Form, type IFormValues } from '@per-form/react';

export default function Demo() {
  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <input name="text" required />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

Check the [documentation](https://tonai.github.io/react-per-form/) for more.

## Examples

Check the [example App](https://github.com/tonai/react-per-form/tree/main/example-app).

Clone this repo and then run:

```bash
npm i
npm run dev
```
