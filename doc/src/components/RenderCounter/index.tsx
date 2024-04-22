import type { ReactElement } from 'react';

import { Badge } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';

import { demoContext } from '@site/src/contexts/demo';

import styles from './styles.module.css';

export default function RenderCounter(): ReactElement {
  const { renderCount: initRenderCount, subscribe } = useContext(demoContext);
  const [renderCount, setRenderCount] = useState(initRenderCount.current);

  useEffect(() => subscribe(setRenderCount), [subscribe]);

  return (
    <Badge className={styles.badge} title="Render count">
      {renderCount}
    </Badge>
  );
}
