import React, { useCallback, useMemo, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import ContactList from '../components/contactList';
import Button from '../components/button';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  // state
  const [mount, setMount] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => [150, 300, 450], []);
  const initialSnapPoint = useRef(0);
  const startPerfTime = useRef(0);
  const endPerfTime = useRef(0);

  // callbacks
  const finishPerformanceTest = useCallback(() => {
    endPerfTime.current = Date.now();
    setShowResult(true);
  }, []);

  const handleMountPress = useCallback(() => {
    startPerfTime.current = Date.now();
    setMount(state => !state);
  }, []);

  const handleAutoAnimatePress = useCallback(() => {
    initialSnapPoint.current = -1;
    handleMountPress();
    let index = 0;
    let loop = 1;

    const timer = setInterval(() => {
      if (loop === 4) {
        clearInterval(timer);
        return;
      }

      if (index > snapPoints.length - 1) {
        index = 0;
        loop++;
      }

      bottomSheetRef.current?.snapTo(index++);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [snapPoints, handleMountPress]);

  // render
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Button
          label="Mount"
          style={styles.buttonContainer}
          onPress={handleMountPress}
        />
        <Button
          label="Auto Animate"
          style={styles.buttonContainer}
          onPress={handleAutoAnimatePress}
        />
        <Text style={styles.version}>Reanimated v2 alpha-6</Text>

        {showResult && (
          <Text style={styles.measure}>
            {endPerfTime.current - startPerfTime.current}ms
          </Text>
        )}

        {mount && (
          <BottomSheet
            ref={bottomSheetRef}
            initialSnapIndex={initialSnapPoint.current}
            snapPoints={snapPoints}
          >
            <ContactList
              type="View"
              count={5}
              onLayout={finishPerformanceTest}
            />
          </BottomSheet>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    marginHorizontal: 24,
    marginBottom: 6,
  },
  measure: {
    marginHorizontal: 24,
    fontSize: 64,
    fontWeight: 'bold',
  },
  version: {
    marginHorizontal: 24,
    marginTop: 12,
    fontSize: 20,
  },
});

export default App;
