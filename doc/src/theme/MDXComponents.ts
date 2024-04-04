import type { ElementType } from 'react';

import { Button, TextInput } from '@mantine/core';
import Demo from '@site/src/components/Demo';
import MdxComponents from '@theme-original/MDXComponents';

export default {
  ...MdxComponents,
  Button,
  Demo: Demo as ElementType,
  TextInput,
};
