import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'React Native Bottom Sheet',
  tagline:
    'A performant interactive bottom sheet with fully configurable options 🚀',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://gorhom.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/react-native-bottom-sheet/',

  organizationName: 'gorhom',
  projectName: 'react-native-bottom-sheet',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  presets: [
    [
      '@gorhom/docusaurus-preset',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl:
            'https://github.com/gorhom/react-native-bottom-sheet/tree/master/website/docs',
          lastVersion: 'current',
          versions: {
            current: {
              label: 'v5',
            },
            '4': {
              label: 'v4 (Reanimated v2)',
              path: 'v4',
              noIndex: true,
              badge: true,
            },
            '2': {
              label: 'v2 (Reanimated v1)',
              path: 'v2',
              noIndex: true,
              badge: true,
            },
          },
        },
        blog: {
          showReadingTime: false,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/gorhom/react-native-bottom-sheet/tree/master/website/blog',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/preview.gif',

    navbar: {
      title: 'React Native Bottom Sheet',
      logo: {
        alt: 'React Native Bottom Sheet',
        src: 'img/logo.svg',
      },
      items: [
        { to: '/blog', label: 'Blog', position: 'left' },

        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
          docsPluginId: 'default',
        },
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
