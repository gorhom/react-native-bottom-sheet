import React, { useCallback } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ContactList from '../components/contactList';
import Button from '../components/button';

interface DummyScreenProps {
  title: string;
  nextScreen: string;
  type: 'FlatList' | 'SectionList' | 'ScrollView';
}

const createDummyScreen = ({
  title,
  nextScreen,
  type,
}: DummyScreenProps) => () => {
  const { navigate } = useNavigation();

  const handleNavigatePress = useCallback(() => {
    navigate(nextScreen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{title}</Text>
        <Button
          label={`Navigate to ${nextScreen}`}
          onPress={handleNavigatePress}
        />
      </View>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ContactList key={`${type}.list`} header={renderHeader()} type={type} />
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 46,
    lineHeight: 46,
    fontWeight: '800',
  },
  headerContainer: {
    paddingVertical: 24,
    backgroundColor: 'white',
  },
});

export default createDummyScreen;
