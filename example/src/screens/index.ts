import type { ShowcaseExampleScreenSectionType } from '@gorhom/showcase-template';
import { Platform } from 'react-native';

const screens: ShowcaseExampleScreenSectionType[] = [];

//#region Basic Section
const basicSection = {
  title: 'Basic',
  collapsible: false,
  data: [
    {
      name: 'View',
      slug: 'Basic/ViewExample',
      getScreen: () => require('./basic/BasicExamples').ViewExampleScreen,
    },
    {
      name: 'ScrollView',
      slug: 'Basic/ScrollViewExample',
      getScreen: () => require('./basic/BasicExamples').ScrollViewExampleScreen,
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
    {
      name: 'VirtualizedList',
      slug: 'Basic/VirtualizedListExample',
      getScreen: () =>
        require('./basic/BasicExamples').VirtualizedListExampleScreen,
    },
  ],
};
screens.push(basicSection);
//#endregion

//#region Modal Section
const modalSection = {
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
      name: 'Dynamic Sizing',
      slug: 'Modal/DynamicSizingExample',
      getScreen: () => require('./modal/DynamicSizingExample').default,
    },
    {
      name: 'Detached',
      slug: 'Modal/DetachedExample',
      getScreen: () => require('./modal/DetachedExample').default,
    },
  ],
};
screens.push(modalSection);
//#endregion

//#region Advanced Section
const advancedSection = {
  title: 'Advanced',
  collapsed: true,
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
      name: 'Custom Theme',
      slug: 'Advanced/CustomThemeExample',
      getScreen: () => require('./advanced/CustomThemeExample').default,
    },
    {
      name: 'Backdrop',
      slug: 'Advanced/BackdropExample',
      getScreen: () => require('./advanced/BackdropExample').default,
    },
    {
      name: 'Dynamic Sizing',
      slug: 'Advanced/DynamicSizingExample',
      getScreen: () => require('./advanced/DynamicSizingExample').default,
    },
    {
      name: 'Shadow',
      slug: 'Advanced/ShadowExample',
      getScreen: () => require('./advanced/ShadowExample').default,
    },
    {
      name: 'Footer',
      slug: 'Advanced/FooterExample',
      getScreen: () => require('./advanced/FooterExample').default,
    },
  ],
};
if (Platform.OS !== 'web') {
  advancedSection.data.push(
    {
      name: 'Keyboard Handling',
      slug: 'Advanced/KeyboardHandlingExample',
      getScreen: () => require('./advanced/KeyboardHandlingExample').default,
    },
    {
      name: 'Pull To Refresh',
      slug: 'Advanced/PullToRefreshExample',
      getScreen: () => require('./advanced/PullToRefreshExample').default,
    }
  );
}
screens.push(advancedSection);
//#endregion

//#region Third Party Integration Section
if (Platform.OS !== 'web') {
  const integrationSection = {
    title: 'Third Party Integration',
    data: [
      {
        name: 'React Navigation',
        slug: 'Integrations/NavigatorExample',
        getScreen: () =>
          require('./integrations/navigation/NavigatorExample').default,
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
        getScreen: () => require('./integrations/map/MapExample').default,
        screenOptions: {
          headerTintColor: 'black',
          headerTransparent: true,
        },
      },
      {
        name: 'FlashList',
        slug: 'Integrations/FlashList',
        getScreen: () => require('./integrations/flashlist').default,
      },
    ],
    collapsed: true,
  };
  screens.push(integrationSection);
}

//#endregion

export { screens };
