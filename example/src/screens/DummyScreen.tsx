import React, { useCallback, memo } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ContactList from '../components/contactList';
import Button from '../components/button';

interface DummyScreenProps {
  title: string;
  nextScreen: string;
  type: 'FlatList' | 'SectionList' | 'ScrollView' | 'View';
  count?: number;
}

const createDummyScreen = ({
  title,
  nextScreen,
  type,
  count = 50,
}: DummyScreenProps) =>
  memo(() => {
    const { navigate } = useNavigation();

    const handleNavigatePress = useCallback(() => {
      // eslint-disable-next-line no-console
      console.log('navigateTo', nextScreen);
      navigate(nextScreen);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderHeader = useCallback(
      () => (
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{title}</Text>
          <Button
            label={`Navigate to ${nextScreen}`.toUpperCase()}
            onPress={handleNavigatePress}
          />
        </View>
      ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    return (
      <ContactList
        key={`${type}.list`}
        count={count}
        header={renderHeader}
        type={type}
      />
    );
  });

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
