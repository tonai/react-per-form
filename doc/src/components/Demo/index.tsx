import type { ElementType, ReactElement } from 'react';

import { Collapse } from '@mantine/core';
import CodeBlock from '@theme/CodeBlock';
import { useState } from 'react';

import styles from './styles.module.css';

interface IDemoProps {
  Component: ElementType;
  content: string;
}

export default function Demo(props: IDemoProps): ReactElement {
  const { Component, content } = props;
  const [log, setLog] = useState('');

  function handleLog(values: unknown): void {
    setLog(JSON.stringify(values, null, 2));
  }

  return (
    <div className={styles.demo}>
      <div className={styles.example}>
        <Component log={handleLog} />
      </div>
      <Collapse in={log.length > 0}>
        <pre className={styles.pre}>{log}</pre>
      </Collapse>
      <CodeBlock className={styles.code} language="tsx" showLineNumbers>
        {content}
      </CodeBlock>
    </div>
  );
}
