import type { ReactElement } from 'react';

import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Button } from '@mantine/core';
import Layout from '@theme/Layout';

import styles from './index.module.css';

export default function Home(): ReactElement {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      description={siteConfig.tagline}
      title="react-per-form Documentation"
    >
      <main className={styles.main}>
        <h1 className={styles.title}>{siteConfig.title}</h1>
        <div className={styles.logo}>
          <img
            alt="react-per-form Logo"
            className="mantine-dark-hidden"
            src="img/logo.svg"
            width="200"
          />
          <img
            alt="react-per-form Logo"
            className="mantine-light-hidden"
            src="img/logo-dark.svg"
            width="200"
          />
        </div>
        <p className={styles.tagline}>{siteConfig.tagline}</p>
        <ul>
          <li>☯ Very easy to use</li>
          <li>🚀 Really fast</li>
          <li>🏋 Extra small bundle size</li>
          <li>🤯 Can works without any state</li>
          <li>💅 Native and customizable errors</li>
          <li>👯 Multiple validation modes</li>
          <li>
            📑 Custom validation with
            <ul>
              <li>🎉 Cross inputs validation</li>
              <li>😎 Async validation</li>
              <li>🔥 Support dynamic form</li>
            </ul>
          </li>
          <li>💬 Custom messages / translations</li>
          <li>💯 Fully tested</li>
          <li>📚 Support controlled components and UI libraries</li>
          <li>⚡️ Compatible with Next.js server actions</li>
          <li>👀 Watch values</li>
          <li>💪 And much more...</li>
        </ul>
        <Button
          className={styles.button}
          component={Link}
          size="xl"
          to="/docs/getting-started"
        >
          Get started now !
        </Button>
      </main>
    </Layout>
  );
}
