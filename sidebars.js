module.exports = {
  packages: [
    {
      type: 'category',
      label: 'Bottom Sheet',
      items: [
        'getting-started',
        'usage',
        'props',
        'methods',
        'hooks',
        'scrollables',
        {
          type: 'category',
          label: 'Components',
          items: [
            'components/bottomsheetview',
            'components/bottomsheetscrollview',
            'components/bottomsheetflatlist',
            'components/bottomsheetsectionlist',
            'components/bottomsheetvirtualizedlist',
            'components/bottomsheetbackdrop',
            'components/bottomsheetfooter',
            'components/bottomsheettextinput',
          ],
        },
        {
          type: 'category',
          label: 'Guides',
          items: [
            'guides/custom-handle',
            'guides/custom-backdrop',
            'guides/custom-background',
            'guides/adding-shadow',
            'guides/react-navigation-integration',
          ],
        },
        'troubleshooting',
        'faq',
      ],
    },
    {
      type: 'category',
      label: 'Bottom Sheet Modal',
      items: [
        'modal/getting-started',
        'modal/usage',
        'modal/props',
        'modal/methods',
        'modal/hooks',
      ],
    },
  ],
};
