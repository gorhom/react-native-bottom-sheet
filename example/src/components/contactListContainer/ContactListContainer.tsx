import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import ContactList, { ContactListProps } from '../contactList';

interface ContactListContainerProps extends Omit<ContactListProps, 'header'> {
  title: string;
  headerStyle: ViewStyle;
}

const ContactListContainerComponent = ({
  count,
  type,
  title,
  headerStyle: _headerStyle,
  onItemPress,
}: ContactListContainerProps) => {
  const headerStyle = useMemo(() => [styles.headerContainer, _headerStyle], [
    _headerStyle,
  ]);
  return (
    <>
      <View style={headerStyle}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <ContactList
        key={`${type}.list`}
        type={type}
        count={count}
        onItemPress={onItemPress}
      />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    lineHeight: 46,
    fontWeight: '800',
  },
  headerContainer: {
    padding: 24,
    backgroundColor: 'white',
    zIndex: 99999,
  },
});

const ContactListContainer = memo(ContactListContainerComponent);

export default ContactListContainer;
