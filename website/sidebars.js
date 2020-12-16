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
        {
          type: 'category',
          label: 'Guides',
          items: [
            'scrollables',
            'react-navigation-integration',
            'custom-handle',
            'custom-backdrop',
            'custom-background',
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
