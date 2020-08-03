import React, { useMemo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList } from '@gorhom/bottom-sheet';
import { createContactListMockData } from '../../utils';
import ContactItem from '../contactItem';

const ContactList = () => {
  // hooks
  const { bottom: bottomSafeArea } = useSafeArea();

  // variables
  const data = useMemo(() => createContactListMockData(), []);

  // styles
  const contentContainerStyle = useMemo(
    () => ({
      ...styles.contentContainer,
      paddingBottom: bottomSafeArea,
    }),
    [bottomSafeArea]
  );

  const handleFocus = useCallback(() => {
    console.log('ContactList', 'Focus');

    return () => {
      console.log('ContactList', 'Blur');
    };
  }, []);

  // effects
  useFocusEffect(handleFocus);

  // renders
  const renderItem = useCallback(
    ({ item, index }) => (
      <ContactItem title={`${item.name}.${index}`} subTitle={item.jobTitle} />
    ),
    []
  );
  return (
    <FlatList
      data={data}
      keyExtractor={i => i.name}
      renderItem={renderItem}
      contentContainerStyle={contentContainerStyle}
      focusHook={useFocusEffect}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 12,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
});

export default ContactList;
