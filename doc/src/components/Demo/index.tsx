import type { IDemoProps } from './DemoContent';
import type { ReactElement } from 'react';

import { useState } from 'react';

import DemoContent from './DemoContent';

export default function Demo(props: IDemoProps): ReactElement {
  const [useNativeValidation, setUseNativeValidation] = useState(false);

  return (
    <DemoContent
      key={String(useNativeValidation)}
      {...props}
      onUseNativeValidationChange={setUseNativeValidation}
      useNativeValidation={useNativeValidation}
    />
  );
}
