import React, { useCallback } from 'react';
import { Text, StyleSheet } from 'react-native';
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
  }, []);

  return (
    <>
      <Text style={styles.title}>{title}</Text>
      <Button
        label={`Navigate to ${nextScreen}`}
        onPress={handleNavigatePress}
      />
      <ContactList />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 46,
    fontWeight: '600',
  },
});

export default createDummyScreen;
