import type { ChangeEvent, ElementType, ReactElement } from 'react';
import type { IError, IFormMode, IFormRevalidateMode } from 'react-swift-form';

import { Badge, Checkbox, Collapse, Select } from '@mantine/core';
import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';
import { useMemo, useState } from 'react';

import { demoContext } from '@site/src/contexts/demo';

import styles from './styles.module.css';

export interface IDemoProps {
  Component: ElementType;
  code: string;
  metastring?: string;
  mode?: IFormMode;
  noBorder?: boolean;
  revalidateMode?: IFormRevalidateMode;
  useNativeValidation?: boolean;
  withModes?: boolean;
  withRevalidateModes?: boolean;
  withUseNativeValidation?: boolean;
}

interface IDemoContentProps extends IDemoProps {
  onModeChange: (mode: IFormMode) => void;
  onRevalidateModeChange: (revalidateMode: IFormRevalidateMode) => void;
  onUseNativeValidationChange: (useNativeValidation: boolean) => void;
}

export default function DemoContent(props: IDemoContentProps): ReactElement {
  const {
    Component,
    code,
    metastring,
    mode = 'submit',
    noBorder,
    onModeChange,
    onRevalidateModeChange,
    onUseNativeValidationChange,
    revalidateMode = 'submit',
    useNativeValidation = true,
    withModes,
    withRevalidateModes,
    withUseNativeValidation,
  } = props;
  const [display, setDisplay] = useState<'error' | 'none' | 'value'>('value');
  const [values, setValues] = useState('');
  const [errors, setErrors] = useState('');

  function handleUseNativeValidationChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    onUseNativeValidationChange(event.target.checked);
  }

  function handleModeChange(value: string | null): void {
    onModeChange(value as IFormMode);
  }

  function handleRevalidateModeChange(value: string | null): void {
    onRevalidateModeChange(value as IFormRevalidateMode);
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
              mode={mode}
              revalidateMode={revalidateMode}
              useNativeValidation={useNativeValidation}
            />
          </div>
          {Boolean(
            withModes || withRevalidateModes || withUseNativeValidation,
          ) && (
            <div className={styles.settings}>
              {Boolean(withUseNativeValidation) && (
                <Checkbox
                  checked={useNativeValidation}
                  label="useNativeValidation"
                  labelPosition="left"
                  onChange={handleUseNativeValidationChange}
                  size="xs"
                />
              )}
              {Boolean(withModes) && (
                <Select
                  allowDeselect={false}
                  data={['submit', 'blur', 'change', 'all']}
                  label="mode"
                  onChange={handleModeChange}
                  size="xs"
                  value={mode}
                />
              )}
              {Boolean(withRevalidateModes) && (
                <Select
                  allowDeselect={false}
                  data={['submit', 'blur', 'change']}
                  label="revalidateMode"
                  onChange={handleRevalidateModeChange}
                  size="xs"
                  value={revalidateMode}
                />
              )}
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
