import type { ElementType } from 'react';

import { Button, TextInput } from '@mantine/core';
import MdxComponents from '@theme-original/MDXComponents';

import Demo from '@site/src/components/Demo';

export default {
  ...MdxComponents,
  Button,
  Demo: Demo as ElementType,
  TextInput,
};
