import type { ButtonProps } from '@mantine/core';
import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactElement,
} from 'react';

import { Button } from '@mantine/core';

import styles from './styles.module.css';

interface IActionButtonProps
  extends ButtonProps,
    Omit<
      JSX.LibraryManagedAttributes<
        'button',
        ComponentPropsWithoutRef<'button'>
      >,
      keyof ButtonProps
    > {
  Icon: ElementType;
  label: string;
}

export default function ActionButton(props: IActionButtonProps): ReactElement {
  const { Icon, label, ...buttonProps } = props;
  return (
    <Button
      className={styles.button}
      size="xs"
      variant="default"
      {...buttonProps}
    >
      <Icon className={styles.icon} />
      {label}
    </Button>
  );
}
