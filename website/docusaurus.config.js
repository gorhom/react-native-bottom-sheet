module.exports = {
  title: 'React Native Bottom Sheet',
  tagline:
    'A performant interactive bottom sheet with fully configurable options 🚀',
  url: 'https://gorhom.github.com',
  baseUrl: '/react-native-bottom-sheet/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'gorhom',
  projectName: 'react-native-bottom-sheet',
  themeConfig: {
    image: 'img/icon.png',
    navbar: {
      title: 'Bottom Sheet',
      hideOnScroll: true,
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
    footer: {
      style: 'dark',
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
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
