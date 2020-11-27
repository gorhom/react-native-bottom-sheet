import React, { useMemo } from 'react';
import Showcase from '@gorhom/showcase-template';
import { useNavigation } from '@react-navigation/native';
import { version, description } from '../../../package.json';
import { useSafeArea } from 'react-native-safe-area-context';

const data = [
  {
    title: 'Static',
    data: [
      {
        name: 'View',
        slug: 'Static/ViewExample',
      },
      {
        name: 'ScrollView',
        slug: 'Static/ScrollViewExample',
      },
      {
        name: 'FlatList',
        slug: 'Static/FlatListExample',
      },
      {
        name: 'SectionList',
        slug: 'Static/SectionListExample',
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
        name: 'Overlay',
        slug: 'Modal/OverlayExample',
      },
      {
        name: 'Stack Modals',
        slug: 'Modal/StackExample',
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
        name: 'Shadow Overlay',
        slug: 'Advanced/OverlayExample',
      },
      {
        name: 'Map',
        slug: 'Advanced/MapExample',
      },
      {
        name: 'Dynamic Snap Point',
        slug: 'Advanced/DynamicSnapPointExample',
      },
    ],
  },
].reverse();

const RootScreen = () => {
  // hooks
  const { navigate } = useNavigation();
  const safeInsets = useSafeArea();

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
