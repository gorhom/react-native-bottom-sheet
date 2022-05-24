import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { ShowcaseApp } from '@gorhom/showcase-template';
import { screens as defaultScreens } from './screens';
import { version, description } from '../../../package.json';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const author = {
  username: 'Mo Gorhom',
  url: 'https://gorhom.dev',
};

interface AppProps {
  screens?: any[];
}

export const App = ({ screens: providedScreens }: AppProps) => {
  const screens = useMemo(
    () => [...defaultScreens, ...(providedScreens ? providedScreens : [])],
    [providedScreens]
  );
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
  },
});
