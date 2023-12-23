import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '../../components/button';
import ModalBackdropExample from '../modal/BackdropExample';
import { withModalProvider } from '../modal/withModalProvider';

const RootScreen = () => {
  const { navigate } = useNavigation();
  return (
    <View style={styles.container}>
      <Button
        label="Navigate to Native Modal"
        // @ts-ignore
        onPress={() => navigate('NativeModal')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});

const NativeStack = createNativeStackNavigator();

export default withModalProvider(() => (
  <NativeStack.Navigator>
    <NativeStack.Screen
      name="Root"
      component={RootScreen}
      options={{ headerShown: false }}
    />
    <NativeStack.Screen
      name="NativeModal"
      component={ModalBackdropExample}
      options={{
        presentation: 'modal',
        headerShown: Platform.OS === 'ios',
      }}
    />
  </NativeStack.Navigator>
));
