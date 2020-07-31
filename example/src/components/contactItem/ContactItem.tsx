import React, { memo } from 'react';
import { Text, StyleSheet, View } from 'react-native';

interface ContactItemProps {
  title: string;
  subTitle?: string;
}

const ContactItemComponent = ({ title, subTitle }: ContactItemProps) => {
  // render
  return (
    <View style={styles.container}>
      <View style={styles.thumbnail} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        {subTitle && <Text style={styles.subtitle}>{subTitle}</Text>}
      </View>
      <View style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignContent: 'center',
    marginVertical: 12,
  },
  contentContainer: {
    flex: 1,
    alignSelf: 'center',
    marginLeft: 12,
  },
  thumbnail: {
    width: 46,
    height: 46,
    borderRadius: 46,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  icon: {
    alignSelf: 'center',
    width: 24,
    height: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.125)',
  },
  title: {
    color: '#111',
    fontSize: 16,
    marginBottom: 4,
    textTransform: 'capitalize',
  },

  subtitle: {
    color: '#444',
    fontSize: 14,
    textTransform: 'capitalize',
  },
});

const ContactItem = memo(ContactItemComponent);

export default ContactItem;
