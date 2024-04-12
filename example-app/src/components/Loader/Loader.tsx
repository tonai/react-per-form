import type { ReactElement } from 'react';

import classNames from 'classnames';
import { useFormStatus } from 'react-dom';

import styles from './Loader.module.css';

export default function Loader(): ReactElement {
  const { pending } = useFormStatus();

  return (
    <div
      className={classNames(styles.loader, { [styles.invisible]: !pending })}
    />
  );
}
