import React, { useCallback, memo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ContactList } from '@gorhom/bottom-sheet-example-app';

interface DummyScreenProps {
  title: string;
  nextScreen: string;
  type: 'FlatList' | 'SectionList' | 'ScrollView' | 'View';
  count?: number;
}

const createDummyScreen = ({
  nextScreen,
  type,
  count = 50,
}: DummyScreenProps) =>
  memo(() => {
    const { navigate } = useNavigation();

    const handleNavigatePress = useCallback(() => {
      requestAnimationFrame(() => navigate(nextScreen as any));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <ContactList
        key={`${type}.list`}
        count={count}
        type={type}
        onItemPress={handleNavigatePress}
      />
    );
  });

export default createDummyScreen;
