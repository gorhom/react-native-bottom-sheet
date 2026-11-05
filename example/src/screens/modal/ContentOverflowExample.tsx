import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useRef, useState } from 'react';
import { Button, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { withModalProvider } from './withModalProvider';

const ContentOverflowExample = () => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button title="Present" onPress={() => sheetRef.current?.present()} />
      <BottomSheetModal
        ref={sheetRef}
        contentOverflow={visible ? 'visible' : 'hidden'}
      >
        <BottomSheetView style={styles.content}>
          <View style={styles.toolbar}>
            <Text>Content overflow</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Dismiss sheet"
              onPress={() => sheetRef.current?.dismiss()}
              style={styles.closeButton}
            >
              {({ pressed }) => (
                <>
                  {pressed && (
                    <View pointerEvents="none" style={styles.pressedEffect} />
                  )}
                  <Text>Close</Text>
                </>
              )}
            </Pressable>
          </View>
          <View style={styles.controls}>
            <Text>Visible content overflow</Text>
            <Switch
              accessibilityLabel="Visible content overflow"
              value={visible}
              onValueChange={setVisible}
            />
          </View>
          <Text>
            Hold Close to see the purple effect extend above the toolbar with
            visible overflow. Release to dismiss. The toolbar has no top padding.
          </Text>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    overflow: 'visible',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    height: 44,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  pressedEffect: {
    position: 'absolute',
    top: -12,
    bottom: -12,
    left: -12,
    right: -12,
    borderRadius: 24,
    backgroundColor: '#bb88ff',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 24,
  },
});

export default withModalProvider(ContentOverflowExample);
