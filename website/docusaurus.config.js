module.exports = {
  title: 'React Native Bottom Sheet',
  tagline:
    'A performant interactive bottom sheet with fully configurable options 🚀',
  url: 'https://gorhom.github.io',
  baseUrl: '/react-native-bottom-sheet/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  organizationName: 'gorhom',
  projectName: 'react-native-bottom-sheet',
  favicon: 'img/favicon.ico',
  themeConfig: {
    image: 'img/icon.png',
    navbar: {
      title: 'Bottom Sheet',
      hideOnScroll: false,
      items: [
        {
          to: 'modal/',
          activeBasePath: 'modal',
          label: 'Bottom Sheet Modal',
          position: 'left',
        },
        {
          href: 'https://github.com/gorhom/react-native-bottom-sheet',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    prism: {
      theme: require('prism-react-renderer/themes/dracula'),
    },
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} <a rel="noreferrer" href="https://gorhom.dev/" target="_blank">Mo Gorhom</a>. Built with Docusaurus.`,
    },
    googleAnalytics: {
      trackingID: 'G-3VBJNN0W64',
      anonymizeIP: true,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          editUrl:
            'https://github.com/gorhom/react-native-bottom-sheet/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: ['@docusaurus/plugin-google-analytics'],
};
