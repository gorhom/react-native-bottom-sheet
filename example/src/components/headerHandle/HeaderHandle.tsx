import {
  BottomSheetHandle,
  type BottomSheetHandleProps,
} from '@gorhom/bottom-sheet';
import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface HeaderHandleProps extends BottomSheetHandleProps {
  titleRef?: React.RefObject<View>;
}

const HeaderHandleComponent = ({
  children,
  titleRef,
  accessibilityFocusRef,
  ...rest
}: HeaderHandleProps) => {
  const hasTitle = typeof children === 'string';
  return (
    <View style={styles.container}>
      <BottomSheetHandle
        indicatorStyle={styles.indicator}
        {...rest}
        accessibilityFocusRef={hasTitle ? undefined : accessibilityFocusRef}
      >
        {hasTitle ? null : children}
      </BottomSheetHandle>
      {hasTitle ? (
        <View
          ref={titleRef ?? accessibilityFocusRef}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel={children}
        >
          <Text style={styles.title}>{children}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.075)',
    zIndex: 99999,
  },
  title: {
    marginTop: 16,
    fontSize: 20,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  indicator: {
    height: 4,
    opacity: 0.5,
  },
});

export const HeaderHandle = memo(HeaderHandleComponent);
