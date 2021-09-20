import React, { ComponentProps, useCallback, useRef } from 'react';
import { CalendarDayKind, Calendar } from '@breeffy/react-native-calendar';
import {
  ContentBottomSheet,
  ContentBottomSheetMethods,
} from './ContentBottomSheet';
import { StyleSheet, View } from 'react-native';
import Button from '../../components/button';

type OnCalendarDayStateChange = NonNullable<
  ComponentProps<typeof Calendar>['onDayStateChange']
>;

interface CalendarExampleProps {}

export const CalendarExample = ({}: CalendarExampleProps) => {
  const bottomSheetRef = useRef<ContentBottomSheetMethods>(null);

  const openBottomSheet = useCallback(() => {
    // console.log(`open bottom sheet`);
    bottomSheetRef.current?.open();
  }, []);

  const onCalendarDayStateChange = useCallback<OnCalendarDayStateChange>(
    (day, kind) => {
      if (kind === CalendarDayKind.SELECTED) {
        // console.log(
        //   `year: [${day.year}], month: [${day.month}], day: [${day.day}] was selected`
        // );
      } else {
        // console.log(`Event [${kind}] happened`);
      }
    },
    []
  );

  return (
    <View style={styles.container}>
      <Button
        label="Open Bottom Sheet"
        onPress={openBottomSheet}
        style={styles.button}
      />
      <ContentBottomSheet ref={bottomSheetRef}>
        <Calendar
          monthsAfter={24}
          monthsBefore={24}
          onDayStateChange={onCalendarDayStateChange}
        />
      </ContentBottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column-reverse',
    width: '100%',
    height: '100%',
  },
  button: {
    marginHorizontal: 15,
  },
});
