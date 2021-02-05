import React, { useMemo } from 'react';
import Showcase from '@gorhom/showcase-template';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { version, description } from '../../../package.json';

const data = [
  {
    title: 'Basic',
    data: [
      {
        name: 'View',
        slug: 'Basic/ViewExample',
      },
      {
        name: 'ScrollView',
        slug: 'Basic/ScrollViewExample',
      },
      {
        name: 'FlatList',
        slug: 'Basic/FlatListExample',
      },
      {
        name: 'SectionList',
        slug: 'Basic/SectionListExample',
      },
    ],
  },
  {
    title: 'Modal',
    data: [
      {
        name: 'Simple',
        slug: 'Modal/SimpleExample',
      },
      {
        name: 'Backdrop',
        slug: 'Modal/BackdropExample',
      },
      {
        name: 'Stack Modals',
        slug: 'Modal/StackExample',
      },
      {
        name: 'Dynamic Snap Point',
        slug: 'Modal/DynamicSnapPointExample',
      },
    ],
  },
  {
    title: 'Advanced',
    data: [
      {
        name: 'React Navigation',
        slug: 'Advanced/NavigatorExample',
      },
      {
        name: 'Custom Handle',
        slug: 'Advanced/CustomHandleExample',
      },
      {
        name: 'Custom Background',
        slug: 'Advanced/CustomBackgroundExample',
      },
      {
        name: 'Backdrop',
        slug: 'Advanced/BackdropExample',
      },
      {
        name: 'Map',
        slug: 'Advanced/MapExample',
      },
      {
        name: 'Dynamic Snap Point',
        slug: 'Advanced/DynamicSnapPointExample',
      },
      {
        name: 'View Pager',
        slug: 'Advanced/ViewPagerExample',
      },
    ],
  },
];

const RootScreen = () => {
  // hooks
  const { navigate } = useNavigation();
  const safeInsets = useSafeAreaInsets();

  // variables
  const author = useMemo(
    () => ({
      username: 'Mo Gorhom',
      url: 'https://gorhom.dev',
    }),
    []
  );

  // callbacks
  const handleOnPress = (slug: string) => navigate(slug);

  // renders
  return (
    <Showcase
      theme="light"
      version={version}
      name="Bottom Sheet"
      description={description}
      author={author}
      data={data}
      safeInsets={safeInsets}
      handleOnPress={handleOnPress}
    />
  );
};

export default RootScreen;
