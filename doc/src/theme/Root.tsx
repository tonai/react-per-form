import type { ReactElement, ReactNode } from 'react';

import {
  MantineProvider,
  createTheme,
  localStorageColorSchemeManager,
} from '@mantine/core';

const theme = createTheme({
  /** Put your mantine theme override here */
});

const colorSchemeManager = localStorageColorSchemeManager({
  key: 'theme',
});

export default function Root({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <MantineProvider colorSchemeManager={colorSchemeManager} theme={theme}>
      {children}
    </MantineProvider>
  );
}
