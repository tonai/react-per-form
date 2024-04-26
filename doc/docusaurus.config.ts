/* eslint-disable sort-keys */
import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';

import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
  title: '@per-form/react',
  tagline:
    'Fast and easy form validation for React based on native HTML capabilities',
  favicon: 'img/logo.svg',

  // Set the production url of your site here
  url: 'https://tonai.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/react-per-form/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'tonai', // Usually your GitHub org/user name.
  projectName: 'react-per-form', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/tonai/react-per-form/tree/main/doc/',
        },
        theme: {
          customCss: [
            '../node_modules/@mantine/core/styles.css',
            './src/css/custom.css',
          ],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    algolia: {
      appId: '0BZTV9W7EU',
      apiKey: '14144602656936f591b60a3e5220f6be',
      indexName: 'tonaiio',
      contextualSearch: false,
      searchParameters: {},
      searchPagePath: 'search',
    },
    respectPrefersColorScheme: true,
    image: 'img/social-card.png',
    navbar: {
      title: '@per-form/react',
      logo: {
        alt: '@per-form/react Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
      },
      items: [
        {
          href: '/docs/getting-started',
          label: 'Getting started',
        },
        {
          href: '/docs/category/guides',
          label: 'Guides',
        },
        {
          href: '/docs/category/api',
          label: 'API',
        },
        {
          href: 'https://github.com/tonai/react-per-form',
          // label: 'GitHub',
          position: 'right',
          className: 'header-github-link',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting started',
              to: '/docs/getting-started',
            },
            {
              label: 'Guides',
              to: '/docs/category/guides',
            },
            {
              label: 'API',
              to: '/docs/category/api',
            },
          ],
        },
        // {
        //   title: 'Community',
        //   items: [
        //     {
        //       label: 'Stack Overflow',
        //       href: 'https://stackoverflow.com/questions/tagged/per-form',
        //     },
        //     {
        //       label: 'Discord',
        //       href: 'https://discordapp.com/invite/docusaurus',
        //     },
        //     {
        //       label: 'Twitter',
        //       href: 'https://twitter.com/docusaurus',
        //     },
        //   ],
        // },
        {
          title: 'Social',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/tonai/react-per-form',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Tony Cabaye`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
