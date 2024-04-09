import type { IDemoProps } from './DemoContent';
import type { ReactElement } from 'react';
import type { IFormMode, IFormRevalidateMode } from 'react-swift-form';

import { localStorageColorSchemeManager } from '@mantine/core';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useMemo, useState } from 'react';

import DemoContent from './DemoContent';

const manager = localStorageColorSchemeManager({
  key: 'theme',
});

export default function Demo(props: IDemoProps): ReactElement {
  const {
    mode: defaultMode = 'submit',
    revalidateMode: defaultRevalidateMode = 'submit',
    useNativeValidation: defaultUseNativeValidation = false,
  } = props;
  const [mode, setMode] = useState<IFormMode>(defaultMode);
  const [revalidateMode, setRevalidateMode] = useState<IFormRevalidateMode>(
    defaultRevalidateMode,
  );
  const [useNativeValidation, setUseNativeValidation] = useState(
    defaultUseNativeValidation,
  );
  const [colorScheme, setColorScheme] = useState(() => manager.get('light'));

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: colorScheme === 'light' ? 'light' : 'dark',
        },
      }),
    [colorScheme],
  );

  useEffect(() => {
    manager.subscribe(setColorScheme);
    return manager.unsubscribe;
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContent
          key={`${mode}-${useNativeValidation}`}
          {...props}
          mode={mode}
          onModeChange={setMode}
          onRevalidateModeChange={setRevalidateMode}
          onUseNativeValidationChange={setUseNativeValidation}
          revalidateMode={revalidateMode}
          useNativeValidation={useNativeValidation}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
}
