import type { ChangeEvent, ElementType, ReactElement } from 'react';
import type { IError } from 'react-swift-form';

import { Badge, Checkbox, Collapse } from '@mantine/core';
import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';
import { useMemo, useState } from 'react';

import { demoContext } from '@site/src/contexts/demo';

import styles from './styles.module.css';

export interface IDemoProps {
  Component: ElementType;
  code: string;
  metastring?: string;
  noBorder?: boolean;
  withUseNativeValidation?: boolean;
}

interface IDemoContentProps extends IDemoProps {
  onUseNativeValidationChange: (useNativeValidation: boolean) => void;
  useNativeValidation?: boolean;
}

export default function DemoContent(props: IDemoContentProps): ReactElement {
  const {
    Component,
    code,
    metastring,
    noBorder,
    onUseNativeValidationChange,
    useNativeValidation,
    withUseNativeValidation,
  } = props;
  const [display, setDisplay] = useState<'error' | 'value'>('value');
  const [values, setValues] = useState('');
  const [errors, setErrors] = useState('');

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    onUseNativeValidationChange(event.target.checked);
  }

  const context = useMemo(
    () => ({
      setDisplay,
      setErrors: (errors: IError): void =>
        setErrors(JSON.stringify(errors, null, 2)),
      setValues: (values: unknown): void =>
        setValues(JSON.stringify(values, null, 2)),
    }),
    [],
  );

  return (
    <demoContext.Provider value={context}>
      <div className={clsx(styles.demo, { [styles.noBorder]: noBorder })}>
        <div className={styles.wrapper}>
          <div className={styles.example}>
            <Component
              useNativeValidation={
                withUseNativeValidation ? useNativeValidation : undefined
              }
            />
          </div>
          {Boolean(withUseNativeValidation) && (
            <div className={styles.settings}>
              <Checkbox
                checked={useNativeValidation}
                label="useNativeValidation"
                onChange={handleChange}
              />
            </div>
          )}
        </div>
        <Collapse
          className={styles.collapse}
          in={values.length > 0 && display === 'value'}
        >
          <Badge className={styles.badge} color="green">
            values
          </Badge>
          <pre className={styles.pre}>{values}</pre>
        </Collapse>
        <Collapse
          className={styles.collapse}
          in={errors.length > 0 && display === 'error'}
        >
          <Badge className={styles.badge} color="red">
            errors
          </Badge>
          <pre className={styles.pre}>{errors}</pre>
        </Collapse>
        <CodeBlock
          className={styles.code}
          language="tsx"
          metastring={metastring}
          showLineNumbers
        >
          {code}
        </CodeBlock>
      </div>
    </demoContext.Provider>
  );
}
