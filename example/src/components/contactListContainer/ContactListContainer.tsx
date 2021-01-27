import React, { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
import ContactList, { ContactListProps } from '../contactList';

interface ContactListContainerProps extends Omit<ContactListProps, 'header'> {
  title: string;
}

const ContactListContainerComponent = ({
  count,
  type,
  title,
  onItemPress,
}: ContactListContainerProps) => {
  // renders
  const renderHeader = useCallback(() => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  }, [title]);
  return (
    <ContactList
      key={`${type}.list`}
      header={renderHeader}
      type={type}
      count={count}
      onItemPress={onItemPress}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    lineHeight: 46,
    fontWeight: '800',
  },
  headerContainer: {
    paddingVertical: 24,
    backgroundColor: 'white',
  },
});

const ContactListContainer = memo(ContactListContainerComponent);

export default ContactListContainer;
