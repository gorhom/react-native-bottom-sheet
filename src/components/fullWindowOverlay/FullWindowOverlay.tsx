import React, { ComponentProps, ReactNode } from 'react';
import { View, Platform } from 'react-native';

// react-native-screens is an optional peer dependency
let RNScreens: {
  FullWindowOverlay: React.ComponentType<{
    children: ReactNode;
  }>;
} | null = null;
try {
  RNScreens = require('react-native-screens');
} catch {}

function FullWindowOverlay({ children, ...rest }: ComponentProps<typeof View>) {
  // check if react-native-screens is installed
  if (!RNScreens) {
    return <>{children}</>;
  }

  // avoid warning from react-native-screens saying FullWindowOverlay is only available on iOS
  if (Platform.OS === 'android') {
    return <View {...rest}>{children}</View>;
  }

  return (
    <RNScreens.FullWindowOverlay {...rest}>
      {children}
    </RNScreens.FullWindowOverlay>
  );
}

export default FullWindowOverlay;
