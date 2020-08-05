import React, { useCallback, memo, useRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import ContactList from '../components/contactList';
import Button from '../components/button';
import { useHeaderHeight } from '@react-navigation/stack';

interface ExampleScreenProps {
  title: string;
  type: 'FlatList' | 'SectionList' | 'ScrollView';
}

const createExampleScreen = ({ type }: ExampleScreenProps) =>
  memo(() => {
    // hooks
    const sheetRef = useRef<BottomSheet>(null);
    const headerHeight = useHeaderHeight();

    // variables
    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

    // callbacks
    const handleSheetChange = useCallback(index => {
      console.log('handleSheetChange', index);
    }, []);
    const handleSnapPress = useCallback(index => {
      sheetRef.current?.snapTo(index);
    }, []);
    const handleClosePress = useCallback(() => {
      sheetRef.current?.close();
    }, []);

    return (
      <View style={styles.container}>
        <Button
          label="Snap To 90%"
          style={styles.buttonContainer}
          onPress={() => handleSnapPress(2)}
        />
        <Button
          label="Snap To 50%"
          style={styles.buttonContainer}
          onPress={() => handleSnapPress(1)}
        />
        <Button
          label="Snap To 25%"
          style={styles.buttonContainer}
          onPress={() => handleSnapPress(0)}
        />
        <Button
          label="Close"
          style={styles.buttonContainer}
          onPress={() => handleClosePress()}
        />
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          initialSnapIndex={1}
          topInset={headerHeight}
          onChange={handleSheetChange}
        >
          <ContactList key={`${type}.list`} type={type} />
        </BottomSheet>
      </View>
    );
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 46,
    lineHeight: 46,
    fontWeight: '800',
  },
  headerContainer: {
    paddingVertical: 24,
    backgroundColor: 'white',
  },
  buttonContainer: {
    marginBottom: 6,
  },
});

export const FlatListExampleScreen = createExampleScreen({
  title: 'FlatList Example',
  type: 'FlatList',
});

export const ScrollViewExampleScreen = createExampleScreen({
  title: 'Title',
  type: 'ScrollView',
});

export const SectionListExampleScreen = createExampleScreen({
  title: 'Title',
  type: 'SectionList',
});
