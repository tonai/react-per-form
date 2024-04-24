/* eslint-disable import/newline-after-import */
import type { MouseEvent, ReactElement } from 'react';

import { openStackBlitz } from '@site/src/helpers/demo';
import Icon from '@site/static/img/stackblitz.svg';

import ActionButton from '../Actionbutton/ActionButton';

interface IStackBlitzProps {
  code: string;
}

export default function StackBlitz(props: IStackBlitzProps): ReactElement {
  const { code } = props;

  function handleClick(event: MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();
    openStackBlitz(code);
  }

  return (
    <ActionButton
      Icon={Icon}
      href="#"
      label="Open in StackBlitz"
      onClick={handleClick}
    />
  );
}
