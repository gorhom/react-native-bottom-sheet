import React, { memo } from 'react';
// @ts-ignore
import { Text, StyleSheet, View, Appearance } from 'react-native';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { useMemo } from 'react';

interface ContactItemProps {
  title: string;
  subTitle?: string;
}

const _colorScheme = Appearance.getColorScheme();

const ContactItemComponent = ({ title, subTitle }: ContactItemProps) => {
  // state
  const [appearance, setAppearance] = useState(_colorScheme);

  // styles
  const titleStyle = useMemo(
    () => ({
      ...styles.title,
      color: appearance === 'dark' ? 'white' : '#111',
    }),
    [appearance]
  );

  // callback
  const handleAppearanceChange = useCallback(({ colorScheme }) => {
    setAppearance(colorScheme);
  }, []);

  // effects
  useEffect(() => {
    Appearance.addChangeListener(handleAppearanceChange);

    return () => {
      Appearance.removeChangeListener(handleAppearanceChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // render
  return (
    <View style={styles.container}>
      <View style={styles.thumbnail} />
      <View style={styles.contentContainer}>
        <Text style={titleStyle}>{title}</Text>
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
    fontSize: 16,
    marginBottom: 4,
    textTransform: 'capitalize',
  },

  subtitle: {
    color: '#666',
    fontSize: 14,
    textTransform: 'capitalize',
  },
});

const ContactItem = memo(ContactItemComponent);

export default ContactItem;
