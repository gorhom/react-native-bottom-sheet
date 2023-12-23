import React from 'react';
import { ShowcaseApp } from '@gorhom/showcase-template';
import { screens } from './src/screens';
import { version, description } from '../package.json';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { enableScreens } from 'react-native-screens';
enableScreens(true);

// @ts-ignore
import { enableLogging } from '@gorhom/bottom-sheet';
enableLogging();

import { StyleSheet } from 'react-native';

const author = {
  username: 'Mo Gorhom',
  url: 'https://gorhom.dev',
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ShowcaseApp
        name="Bottom Sheet"
        description={description}
        version={version}
        author={author}
        data={screens}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
