import React, { useMemo } from 'react';
import Showcase from '@gorhom/showcase-template';
import { useNavigation } from '@react-navigation/native';
import { version, description } from '../../../package.json';
import { useSafeArea } from 'react-native-safe-area-context';

const data = [
  {
    title: 'Basic',
    data: [
      {
        name: 'View',
        slug: 'ViewExample',
      },
      {
        name: 'ScrollView',
        slug: 'ScrollViewExample',
      },
      {
        name: 'FlatList',
        slug: 'FlatListExample',
      },
      {
        name: 'SectionList',
        slug: 'SectionListExample',
      },
    ],
  },
  {
    title: 'Advanced',
    data: [
      {
        name: 'React Navigation',
        slug: 'NavigatorExample',
      },
      {
        name: 'Custom Handle',
        slug: 'CustomHandleExample',
      },
      {
        name: 'Shadow Overlay',
        slug: 'ShadowOverlayExample',
      },
      {
        name: 'Map',
        slug: 'MapExample',
      },
    ],
  },
];

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
