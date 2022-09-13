import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  // state
  const [end, setEnd] = useState(false);
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
    // initialSnapPoint.current = -1;
    // handleMountPress();
    let index = 0;
    let loop = 1;

    const timer = setInterval(() => {
      if (loop === 4) {
        clearInterval(timer);
        setEnd(state => !state);
        return;
      }

      if (index > snapPoints.length - 1) {
        index = 0;
        loop++;
      }

      bottomSheetRef.current?.snapToIndex(index++);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [snapPoints]);

  // effects
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleMountPress();
      clearTimeout(timeout);
    }, 5000);

    const timeout2 = setTimeout(() => {
      handleAutoAnimatePress();
      clearTimeout(timeout2);
    }, 10000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(timeout2);
    };
  }, [handleMountPress, handleAutoAnimatePress]);
  // render
  return end ? (
    <View style={styles.endContainer} />
  ) : (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.version}>Bottom Sheet v2 alpha-0</Text>
        <Text style={styles.version}>Reanimated v2 alpha-6</Text>

        {showResult && (
          <Text style={styles.measure}>
            {endPerfTime.current - startPerfTime.current}ms
          </Text>
        )}

        {mount && (
          <BottomSheet
            ref={bottomSheetRef}
            index={initialSnapPoint.current}
            snapPoints={snapPoints}
          >
            <View style={styles.content} onLayout={finishPerformanceTest} />
          </BottomSheet>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#555',
  },
  endContainer: {
    flex: 1,
    backgroundColor: 'red',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonContainer: {
    marginHorizontal: 24,
    marginBottom: 6,
  },
  measure: {
    marginHorizontal: 24,
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
  },
  version: {
    marginHorizontal: 24,
    marginTop: 12,
    color: 'white',
    fontSize: 20,
  },
});

export default App;
