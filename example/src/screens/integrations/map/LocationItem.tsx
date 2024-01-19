import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ShowcaseLabel } from '@gorhom/showcase-template';

interface LocationItemProps {
  title: string;
  subTitle?: string;
}

const LocationItemComponent = ({ title, subTitle }: LocationItemProps) => {
  // render
  return (
    <>
      <View style={styles.container}>
        <View style={styles.thumbnail} />
        <View style={styles.contentContainer}>
          <ShowcaseLabel style={styles.title}>{title}</ShowcaseLabel>
          {subTitle && (
            <ShowcaseLabel style={styles.subtitle}>{subTitle}</ShowcaseLabel>
          )}
        </View>
      </View>
      <View style={styles.separator} />
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
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  subtitle: {
    color: '#999',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  separator: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#666',
  },
});

export const LocationItem = memo(LocationItemComponent);
