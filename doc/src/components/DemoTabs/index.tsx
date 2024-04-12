import type { ElementType, ReactElement } from 'react';

import { Tabs } from '@mantine/core';
import { memo } from 'react';

import Demo from '../Demo';

import styles from './styles.module.css';

interface IDemoProps {
  Component: ElementType;
  Hook: ElementType;
  componentCode: string;
  componentMetastring?: string;
  hookCode: string;
  hookMetastring?: string;
  withModes?: boolean;
  withRevalidateModes?: boolean;
  withUseNativeValidation?: boolean;
}

function DemoTabs(props: IDemoProps): ReactElement {
  const {
    Component,
    Hook,
    componentCode,
    componentMetastring,
    hookCode,
    hookMetastring,
    withModes = false,
    withRevalidateModes = false,
    withUseNativeValidation = true,
  } = props;

  return (
    <div className={styles.demoTabs}>
      <Tabs defaultValue="hook">
        <Tabs.List>
          <Tabs.Tab value="hook">Hook version</Tabs.Tab>
          <Tabs.Tab value="component">Component version</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="hook">
          <Demo
            Component={Hook}
            code={hookCode}
            metastring={hookMetastring}
            noBorder
            withModes={withModes}
            withRevalidateModes={withRevalidateModes}
            withUseNativeValidation={withUseNativeValidation}
          />
        </Tabs.Panel>
        <Tabs.Panel value="component">
          <Demo
            Component={Component}
            code={componentCode}
            metastring={componentMetastring}
            noBorder
            withModes={withModes}
            withRevalidateModes={withRevalidateModes}
            withUseNativeValidation={withUseNativeValidation}
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default memo(DemoTabs);
