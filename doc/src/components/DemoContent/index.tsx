import type { IProps } from '../../demo/types';
import type { ChangeEvent, ComponentType, ReactElement } from 'react';
import type { IError, IFormMode, IFormRevalidateMode } from 'react-swift-form';

import BrowserOnly from '@docusaurus/BrowserOnly';
import { Badge, Checkbox, Collapse, Select } from '@mantine/core';
import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';
import { memo, useCallback, useMemo, useRef, useState } from 'react';

import { demoContext } from '@site/src/contexts/demo';

import CodeSandbox from '../CodeSandbox/CodeSandbox';
import RenderCounter from '../RenderCounter';
import StackBlitz from '../StackBlitz/StackBlitz';

import styles from './styles.module.css';

export interface IDemoProps {
  Component: ComponentType<IProps>;
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
  const MemoComponent = useMemo(() => memo(Component), [Component]);

  // Render
  const renderCount = useRef(0);
  const subscribers = useRef<Set<(value: number) => void>>(new Set());
  const subscribe = useCallback((subscriber: (value: number) => void) => {
    if (!subscribers.current.has(subscriber)) {
      subscribers.current.add(subscriber);
    }
    return () => subscribers.current.delete(subscriber);
  }, []);
  const notify = useCallback((value: number) => {
    if (value !== renderCount.current) {
      for (const subscriber of subscribers.current.values()) {
        subscriber(value);
      }
    }
    renderCount.current = value;
  }, []);

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
      renderCount,
      setDisplay,
      setErrors: (errors: IError): void =>
        setErrors(JSON.stringify(errors, null, 2)),
      setRenderCount: notify,
      setValues: (values: unknown): void =>
        setValues(JSON.stringify(values, null, 2)),
      subscribe,
    }),
    [notify, renderCount, subscribe],
  );

  return (
    <demoContext.Provider value={context}>
      <div className={clsx(styles.demo, { [styles.noBorder]: noBorder })}>
        <div className={styles.wrapper}>
          <div className={styles.example}>
            <RenderCounter />
            <MemoComponent
              filterLocalErrors={false}
              mode={mode}
              revalidateMode={revalidateMode}
              useNativeValidation={useNativeValidation}
            />
            <BrowserOnly>
              {() => (
                <div className={styles.actions}>
                  <CodeSandbox code={code} />
                  <StackBlitz code={code} />
                </div>
              )}
            </BrowserOnly>
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
