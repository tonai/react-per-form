import type { ReactElement } from 'react';

import { getCodeSandboxUrl } from '@site/src/helpers/demo';
import Icon from '@site/static/img/codesandbox.svg';

import ActionButton from '../Actionbutton/ActionButton';

interface ICodeSandboxProps {
  code: string;
}

export default function CodeSandbox(props: ICodeSandboxProps): ReactElement {
  const { code } = props;

  return (
    <ActionButton
      Icon={Icon}
      href={getCodeSandboxUrl(code)}
      label="Open in CodeSandbox"
      rel="noopener noreferrer"
      target="_blank"
    />
  );
}
