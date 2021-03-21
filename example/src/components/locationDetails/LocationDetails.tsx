import React, { useCallback } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ShowcaseLabel } from '@gorhom/showcase-template';
import Button from '../button';
import type { Location } from '../../types';

const keyExtractor = (item: string, index: number) => `${index}${item}`;
const photoSize = 180;

export const LOCATION_DETAILS_HEIGHT = 298;

interface LocationDetailsProps extends Location {
  onClose: () => void;
}

const LocationDetails = ({
  name,
  address,
  photos,
  onClose,
}: LocationDetailsProps) => {
  const renderPhoto = useCallback(({ item }) => {
    return (
      <Image
        style={styles.photo}
        width={photoSize}
        height={photoSize / 1.5}
        resizeMode="cover"
        source={{ uri: item }}
      />
    );
  }, []);
  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  );
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContentContainer}>
          <ShowcaseLabel style={styles.name}>{name}</ShowcaseLabel>
          <ShowcaseLabel style={styles.address}>{address}</ShowcaseLabel>
        </View>

        <Button
          label="X"
          onPress={onClose}
          style={styles.closeButton}
          labelStyle={styles.closeText}
        />
      </View>

      <Button
        label="Directions"
        style={styles.directionsButton}
        onPress={() => {}}
      />

      <FlatList
        data={photos}
        horizontal={true}
        renderItem={renderPhoto}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        style={styles.flatListContainer}
        contentContainerStyle={styles.flatListContentContainer}
      />

      <View style={styles.actionsContainer}>
        <Button
          label="Call"
          labelStyle={styles.actionButtonLabel}
          style={styles.actionButton}
          onPress={() => {}}
        />
        <Button
          label="Save"
          labelStyle={styles.actionButtonLabel}
          style={styles.actionButton}
          onPress={() => {}}
        />
        <Button
          label="Share"
          labelStyle={styles.actionButtonLabel}
          style={styles.actionButton}
          onPress={() => {}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  // header
  headerContainer: {
    flexDirection: 'row',
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  headerContentContainer: {
    flexGrow: 1,
  },
  name: {
    fontSize: 22,
    lineHeight: 22,
    fontWeight: '700',
  },
  address: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '400',
  },
  closeButton: {
    alignContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 30,
    padding: 0,
  },
  closeText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 30,
  },
  directionsButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#027AFF',
  },
  // photos
  flatListContainer: {
    paddingVertical: 8,
  },
  flatListContentContainer: {
    paddingHorizontal: 16,
  },
  separator: {
    width: 4,
  },
  photo: {
    width: photoSize,
    height: photoSize / 1.5,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  // actions
  actionsContainer: {
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 8,
    flexDirection: 'row',
    alignContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
    borderRadius: 10,
    minHeight: 40,
  },
  actionButtonLabel: {
    color: '#027AFF',
  },
});

export default LocationDetails;
