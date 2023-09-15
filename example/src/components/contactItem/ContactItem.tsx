import React, { memo, useMemo } from 'react';
import { Text, StyleSheet, View, TextStyle, ViewStyle } from 'react-native';
import { TouchableOpacity } from '@gorhom/bottom-sheet';

interface ContactItemProps {
  title: string;
  subTitle?: string;
  titleStyle?: TextStyle;
  subTitleStyle?: TextStyle;
  thumbnailStyle?: ViewStyle;
  iconStyle?: ViewStyle;
  onPress?: () => void;
}

const ContactItemComponent = ({
  title,
  subTitle,
  titleStyle,
  subTitleStyle,
  thumbnailStyle,
  iconStyle,
  onPress,
}: ContactItemProps) => {
  const ContentWrapper = useMemo<any>(
    () => (onPress ? TouchableOpacity : View),
    [onPress]
  );
  // render
  return (
    <ContentWrapper onPress={onPress} style={styles.container}>
      <View style={[styles.thumbnail, thumbnailStyle]} />
      <View style={styles.contentContainer}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {subTitle && (
          <Text style={[styles.subtitle, subTitleStyle]}>{subTitle}</Text>
        )}
      </View>
      <View style={[styles.icon, iconStyle]} />
    </ContentWrapper>
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
    color: '#666',
    fontSize: 14,
    textTransform: 'capitalize',
  },
});

export const ContactItem = memo(ContactItemComponent);
