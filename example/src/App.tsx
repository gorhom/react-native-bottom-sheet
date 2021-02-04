import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppearanceProvider from './components/appearanceProvider';
import type { AppStackParamsList } from './types';

const Stack = createStackNavigator<AppStackParamsList>();
const App = () => {
  return (
    <AppearanceProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Root">
          <Stack.Screen
            name="Root"
            getComponent={() => require('./screens/Root').default}
            options={{ headerShown: false }}
          />
          {/* static examples */}
          <Stack.Screen
            name="Static/FlatListExample"
            options={{
              title: 'FlatList Example',
            }}
            getComponent={() =>
              require('./screens/static/BasicExamples').FlatListExampleScreen
            }
          />
          <Stack.Screen
            name="Static/SectionListExample"
            options={{
              title: 'SectionList Example',
            }}
            getComponent={() =>
              require('./screens/static/BasicExamples').SectionListExampleScreen
            }
          />
          <Stack.Screen
            name="Static/ScrollViewExample"
            options={{
              title: 'ScrollView Example',
            }}
            getComponent={() =>
              require('./screens/static/BasicExamples').ScrollViewExampleScreen
            }
          />
          <Stack.Screen
            name="Static/ViewExample"
            options={{
              title: 'View Example',
            }}
            getComponent={() =>
              require('./screens/static/BasicExamples').ViewExampleScreen
            }
          />
          {/* modal examples */}
          <Stack.Screen
            name="Modal/SimpleExample"
            options={{
              title: 'Modal Simple Example',
            }}
            getComponent={() =>
              require('./screens/modal/SimpleExample').default
            }
          />
          <Stack.Screen
            name="Modal/BackdropExample"
            options={{
              title: 'Modal Backdrop Example',
            }}
            getComponent={() =>
              require('./screens/modal/BackdropExample').default
            }
          />
          <Stack.Screen
            name="Modal/StackExample"
            options={{
              title: 'Stack Modals Example',
            }}
            getComponent={() => require('./screens/modal/StackExample').default}
          />
          <Stack.Screen
            name="Modal/StackWithBottomInsetExample"
            options={{
              title: 'Stack Modals With Footer Example',
            }}
            getComponent={() =>
              require('./screens/modal/StackWithBottomInsetExample').default
            }
          />
          <Stack.Screen
            name="Modal/DynamicSnapPointExample"
            options={{
              title: 'Dynamic Snap Point',
            }}
            getComponent={() =>
              require('./screens/modal/DynamicSnapPointExample').default
            }
          />
          {/* advanced examples */}
          <Stack.Screen
            name="Advanced/NavigatorExample"
            options={{
              title: 'Navigator Example',
            }}
            getComponent={() =>
              require('./screens/advanced/NavigatorExample').default
            }
          />
          <Stack.Screen
            name="Advanced/CustomHandleExample"
            options={{
              title: 'Custom Handle Example',
            }}
            getComponent={() =>
              require('./screens/advanced/CustomHandleExample').default
            }
          />
          <Stack.Screen
            name="Advanced/CustomBackgroundExample"
            options={{
              title: 'Custom Background Example',
            }}
            getComponent={() =>
              require('./screens/advanced/CustomBackgroundExample').default
            }
          />
          <Stack.Screen
            name="Advanced/BackdropExample"
            options={{
              title: 'Backdrop Example',
            }}
            getComponent={() =>
              require('./screens/advanced/BackdropExample').default
            }
          />
          <Stack.Screen
            name="Advanced/MapExample"
            options={{
              headerShown: false,
            }}
            getComponent={() =>
              require('./screens/advanced/MapExample').default
            }
          />
          <Stack.Screen
            name="Advanced/DynamicSnapPointExample"
            options={{
              title: 'Dynamic Snap Point',
            }}
            getComponent={() =>
              require('./screens/advanced/DynamicSnapPointExample').default
            }
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppearanceProvider>
  );
};

export default App;
