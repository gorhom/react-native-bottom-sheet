import type { ShowcaseExampleScreenType } from '@gorhom/showcase-template';

export const screens = [
  {
    title: 'Third Party Integration',
    data: [
      {
        name: 'React Navigation',
        slug: 'Integrations/NavigatorExample',
        getScreen: () => require('./integrations/NavigatorExample').default,
      },
      {
        name: 'React Native Screens',
        slug: 'Integrations/NativeScreensExample',
        getScreen: () => require('./integrations/NativeScreensExample').default,
      },
      {
        name: 'View Pager',
        slug: 'Integrations/ViewPagerExample',
        getScreen: () => require('./integrations/ViewPagerExample').default,
      },
      {
        name: 'Map',
        slug: 'Integrations/MapExample',
        getScreen: () => require('./integrations/MapExample').default,
        screenOptions: {
          headerTintColor: 'black',
          headerTransparent: true,
        },
      },
    ] as ShowcaseExampleScreenType[],
  },
];
