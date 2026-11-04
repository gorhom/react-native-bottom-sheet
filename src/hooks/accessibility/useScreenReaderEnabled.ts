import { useEffect } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

export function useScreenReaderEnabled() {
  const enabled = useSharedValue(false);
  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }
    let mounted = true;
    let receivedEvent = false;
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      value => {
        receivedEvent = true;
        enabled.value = value;
      }
    );
    AccessibilityInfo.isScreenReaderEnabled().then(
      value => {
        if (mounted && !receivedEvent) {
          enabled.value = value;
        }
      },
      () => {}
    );
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, [enabled]);
  return enabled;
}
