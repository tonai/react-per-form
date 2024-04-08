import type { IDemoProps } from './DemoContent';
import type { ReactElement } from 'react';
import type { IFormMode, IFormRevalidateMode } from 'react-swift-form';

import { useState } from 'react';

import DemoContent from './DemoContent';

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

  return (
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
  );
}
