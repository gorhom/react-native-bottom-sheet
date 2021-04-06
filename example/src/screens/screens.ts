import type { ShowcaseScreenType } from '@gorhom/showcase-template';

export const screens = [
  {
    title: 'Basic',
    data: [
      {
        name: 'View',
        slug: 'Basic/ViewExample',
        getScreen: () => require('./basic/BasicExamples').ViewExampleScreen,
      },
      {
        name: 'ScrollView',
        slug: 'Basic/ScrollViewExample',
        getScreen: () =>
          require('./basic/BasicExamples').ScrollViewExampleScreen,
      },
      {
        name: 'FlatList',
        slug: 'Basic/FlatListExample',
        getScreen: () => require('./basic/BasicExamples').FlatListExampleScreen,
      },
      {
        name: 'SectionList',
        slug: 'Basic/SectionListExample',
        getScreen: () =>
          require('./basic/BasicExamples').SectionListExampleScreen,
      },
    ],
  },
  {
    title: 'Modal',
    data: [
      {
        name: 'Simple',
        slug: 'Modal/SimpleExample',
        getScreen: () => require('./modal/SimpleExample').default,
      },
      {
        name: 'Backdrop',
        slug: 'Modal/BackdropExample',
        getScreen: () => require('./modal/BackdropExample').default,
      },
      {
        name: 'Stack Modals',
        slug: 'Modal/StackExample',
        getScreen: () => require('./modal/StackExample').default,
      },
      {
        name: 'Dynamic Snap Point',
        slug: 'Modal/DynamicSnapPointExample',
        getScreen: () => require('./modal/DynamicSnapPointExample').default,
      },
    ],
  },
  {
    title: 'Advanced',
    data: [
      {
        name: 'Custom Handle',
        slug: 'Advanced/CustomHandleExample',
        getScreen: () => require('./advanced/CustomHandleExample').default,
      },
      {
        name: 'Custom Background',
        slug: 'Advanced/CustomBackgroundExample',
        getScreen: () => require('./advanced/CustomBackgroundExample').default,
      },
      {
        name: 'Backdrop',
        slug: 'Advanced/BackdropExample',
        getScreen: () => require('./advanced/BackdropExample').default,
      },
      {
        name: 'Dynamic Snap Point',
        slug: 'Advanced/DynamicSnapPointExample',
        getScreen: () => require('./advanced/DynamicSnapPointExample').default,
      },
      {
        name: 'Keyboard Handling',
        slug: 'Advanced/KeyboardHandlingExample',
        getScreen: () => require('./advanced/KeyboardHandlingExample').default,
      },
      {
        name: 'Shadow',
        slug: 'Advanced/ShadowExample',
        getScreen: () => require('./advanced/ShadowExample').default,
      },
    ] as ShowcaseScreenType[],
  },
  {
    title: 'Third Party Integration',
    data: [
      {
        name: 'React Navigation',
        slug: 'Integrations/NavigatorExample',
        getScreen: () => require('./integrations/NavigatorExample').default,
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
          headerTransparent: true,
        },
      },
    ] as ShowcaseScreenType[],
  },
];
