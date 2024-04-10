import type { ReactElement, ReactNode } from 'react';

import {
  MantineProvider,
  createTheme,
  localStorageColorSchemeManager,
} from '@mantine/core';

const theme = createTheme({
  primaryColor: 'cyan',
  primaryShade: { dark: 6, light: 8 },
});

const manager = localStorageColorSchemeManager({
  key: 'theme',
});

export default function Root({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <MantineProvider colorSchemeManager={manager} theme={theme}>
      {children}
    </MantineProvider>
  );
}
