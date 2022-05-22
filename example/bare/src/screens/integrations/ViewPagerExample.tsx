import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BottomSheet from '@gorhom/bottom-sheet';
import { ContactList } from '@gorhom/bottom-sheet-example-app';

const FirstRoute = () => {
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  return (
    <View style={[styles.scene, styles.firstScene]}>
      <BottomSheet
        snapPoints={snapPoints}
        activeOffsetY={[-1, 1]}
        failOffsetX={[-5, 5]}
        animateOnMount={true}
      >
        <ContactList type="FlatList" count={15} />
      </BottomSheet>
    </View>
  );
};

const SecondRoute = () => (
  <View style={[styles.scene, styles.secondScene]}>
    <Text style={styles.emoji}>🙈</Text>
  </View>
);

const Tab = createMaterialTopTabNavigator();

const ViewPagerScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={FirstRoute} />
      <Tab.Screen name="Settings" component={SecondRoute} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  firstScene: {
    backgroundColor: '#ff4081',
  },
  secondScene: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#673ab7',
  },
  emoji: {
    fontSize: 46,
  },
});

export default ViewPagerScreen;
