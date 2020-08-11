import React from 'react';
import Showcase from '@gorhom/showcase-template';
import { useNavigation } from '@react-navigation/native';
import { version, description } from '../../../package.json';

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
    ],
  },
];

const RootScreen = () => {
  // hooks
  const { navigate } = useNavigation();

  // callbacks
  const handleOnPress = (slug: string) => navigate(slug);

  // renders
  return (
    <Showcase
      theme="light"
      version={version}
      name="Bottom Sheet"
      description={description}
      author={{
        username: 'Mo Gorhom',
        url: 'https://gorhom.dev',
      }}
      data={data}
      handleOnPress={handleOnPress}
    />
  );
};

export default RootScreen;
