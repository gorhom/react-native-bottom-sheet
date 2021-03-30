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
          label: 'Guides',
          items: [
            'custom-handle',
            'custom-backdrop',
            'custom-background',
            'react-navigation-integration',
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
