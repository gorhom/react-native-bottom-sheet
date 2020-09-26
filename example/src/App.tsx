import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { AppStackParamsList } from './types';

const Stack = createStackNavigator<AppStackParamsList>();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Modal/MultipleExample">
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
          getComponent={() => require('./screens/modal/SimpleExample').default}
        />
        <Stack.Screen
          name="Modal/OverlayExample"
          options={{
            title: 'Modal Overlay Example',
          }}
          getComponent={() => require('./screens/modal/OverlayExample').default}
        />
        <Stack.Screen
          name="Modal/MultipleExample"
          options={{
            title: 'Modal Multiple Example',
          }}
          getComponent={() =>
            require('./screens/modal/MultipleExample').default
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
          name="Advanced/OverlayExample"
          options={{
            title: 'Overlay Example',
          }}
          getComponent={() =>
            require('./screens/advanced/OverlayExample').default
          }
        />
        <Stack.Screen
          name="Advanced/MapExample"
          options={{
            headerShown: false,
          }}
          getComponent={() => require('./screens/advanced/MapExample').default}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
