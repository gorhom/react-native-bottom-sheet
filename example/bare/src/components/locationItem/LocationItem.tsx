import React, { useMemo, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ShowcaseLabel, useShowcaseTheme } from '@gorhom/showcase-template';

interface LocationItemProps {
  title: string;
  subTitle?: string;
}

const LocationItemComponent = ({ title, subTitle }: LocationItemProps) => {
  const { colors } = useShowcaseTheme();
  const separatorStyle = useMemo(
    () => [
      styles.separator,
      {
        backgroundColor: colors.border,
      },
    ],
    [colors.border]
  );
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

export const LocationItem = memo(LocationItemComponent);
