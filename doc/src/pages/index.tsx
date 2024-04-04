import type { ReactElement } from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Button } from '@mantine/core';
import Layout from '@theme/Layout';

import styles from './index.module.css';

export default function Home(): ReactElement {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      description={siteConfig.tagline}
      title="react-swift-form Documentation"
    >
      <main className={styles.main}>
        <h1 className={styles.title}>{siteConfig.title}</h1>
        <p>{siteConfig.tagline}</p>
        <ul>
          <li>🌸 Very easy to use</li>
          <li>🚀 Really fast</li>
          <li>💅 Native and customizable errors</li>
          <li>👯 Multiple validation modes</li>
          <li>
            📑 Custom validation with
            <ul>
              <li>Cross inputs validation</li>
              <li>Global form validation</li>
              <li>Support dynamic form</li>
            </ul>
          </li>
          <li>💬 Custom messages / translations</li>
          <li>💯 Fully tested</li>
          <li>📚 Support controlled components and UI libraries</li>
          <li>👀 Watch values</li>
          <li>🔥 And more...</li>
        </ul>
        <Button className={styles.button} size="xl">
          Get started now !
        </Button>
      </main>
    </Layout>
  );
}
