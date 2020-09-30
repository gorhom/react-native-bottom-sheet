import React, { useMemo, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppearance } from '../../hooks';
import Text from '../text';

interface LocationItemProps {
  title: string;
  subTitle?: string;
}

const LocationItemComponent = ({ title, subTitle }: LocationItemProps) => {
  const { appearance } = useAppearance();
  const separatorStyle = useMemo(
    () => [
      styles.separator,
      {
        backgroundColor:
          appearance === 'light'
            ? 'rgba(0,0,0,0.125)'
            : 'rgba(255,255,255,0.125)',
      },
    ],
    [appearance]
  );
  // render
  return (
    <>
      <View style={styles.container}>
        <View style={styles.thumbnail} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          {subTitle && <Text style={styles.subtitle}>{subTitle}</Text>}
        </View>
      </View>
      <View style={separatorStyle} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  contentContainer: {
    flex: 1,
    alignSelf: 'center',
    marginLeft: 12,
  },
  thumbnail: {
    width: 32,
    height: 32,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  separator: {
    flex: 1,
    height: 1,
  },
});

const LocationItem = memo(LocationItemComponent);

export default LocationItem;
