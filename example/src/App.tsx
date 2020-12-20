import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppStackParamsList } from './types';

const Stack = createStackNavigator<AppStackParamsList>();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Root">
        <Stack.Screen
          name="Root"
          getComponent={() => require('./screens/Root').default}
          options={{ headerShown: false }}
        />
        {/* basic examples */}
        <Stack.Screen
          name="Basic/FlatListExample"
          getComponent={() =>
            require('./screens/basic/BasicExamples').FlatListExampleScreen
          }
        />
        <Stack.Screen
          name="Basic/SectionListExample"
          getComponent={() =>
            require('./screens/basic/BasicExamples').SectionListExampleScreen
          }
        />
        <Stack.Screen
          name="Basic/ScrollViewExample"
          getComponent={() =>
            require('./screens/basic/BasicExamples').ScrollViewExampleScreen
          }
        />
        <Stack.Screen
          name="Basic/ViewExample"
          getComponent={() =>
            require('./screens/basic/BasicExamples').ViewExampleScreen
          }
        />
        {/* modal examples */}
        <Stack.Screen
          name="Modal/SimpleExample"
          options={{
            title: 'Modal Simple Example',
          }}
          getComponent={() => require('./screens/modal/SimpleExample').default}
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
          getComponent={() =>
            require('./screens/advanced/NavigatorExample').default
          }
        />
        <Stack.Screen
          name="Advanced/CustomHandleExample"
          getComponent={() =>
            require('./screens/advanced/CustomHandleExample').default
          }
        />
        <Stack.Screen
          name="Advanced/BackdropExample"
          getComponent={() =>
            require('./screens/advanced/BackdropExample').default
          }
        />
        <Stack.Screen
          name="Advanced/MapExample"
          options={{
            headerShown: false,
          }}
          getComponent={() => require('./screens/advanced/MapExample').default}
        />
        <Stack.Screen
          name="Advanced/DynamicSnapPointExample"
          getComponent={() =>
            require('./screens/advanced/DynamicSnapPointExample').default
          }
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
