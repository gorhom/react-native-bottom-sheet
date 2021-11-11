import { useEffect, useState } from 'react';
import { AccessibilityEvent, AccessibilityInfo } from 'react-native';

export const useScreenReader = () => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState<boolean>();

  useEffect(() => {
    const handleScreenReaderChanged = (event: AccessibilityEvent) => {
      setIsScreenReaderEnabled(event as boolean);
    };

    // sets initial screenReader value
    AccessibilityInfo.isScreenReaderEnabled().then(setIsScreenReaderEnabled);

    AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      handleScreenReaderChanged
    );

    return () => {
      AccessibilityInfo.removeEventListener(
        'screenReaderChanged',
        handleScreenReaderChanged
      );
    };
  }, []);

  return { isScreenReaderEnabled };
};
