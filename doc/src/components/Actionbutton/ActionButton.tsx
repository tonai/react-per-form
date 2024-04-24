import type { ButtonProps, ElementProps } from '@mantine/core';
import type { ElementType, ReactElement } from 'react';

import { Button } from '@mantine/core';

import styles from './styles.module.css';

interface IActionButtonProps
  extends ButtonProps,
    ElementProps<'a', keyof ButtonProps> {
  Icon: ElementType;
  label: string;
}

export default function ActionButton(props: IActionButtonProps): ReactElement {
  const { Icon, label, ...buttonProps } = props;
  return (
    <Button
      className={styles.button}
      component="a"
      size="xs"
      variant="default"
      {...buttonProps}
    >
      <Icon className={styles.icon} />
      {label}
    </Button>
  );
}
