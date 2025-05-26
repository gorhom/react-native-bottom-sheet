import type { LegendListRenderItemProps } from '@legendapp/list';
import Faker from 'faker';
import { memo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

export interface Item {
  id: string;
}

// Generate random metadata
const randomAvatars = Array.from(
  { length: 20 },
  (_, i) => `https://i.pravatar.cc/150?img=${i + 1}`
);

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export const ItemCard = memo(({ item }: LegendListRenderItemProps<Item>) => {
  const indexForData = item.id.includes('new')
    ? 100 + +item.id.replace('new', '')
    : +item.id;

  const randomText = Faker.lorem.sentences(10);
  const avatarUrl = randomAvatars[indexForData % randomAvatars.length];
  const authorName = Faker.name.firstName();
  const timestamp = `${Math.max(1, indexForData % 24)}h ago`;

  return (
    <View style={styles.itemOuterContainer}>
      <View style={styles.itemContainer}>
        <View style={styles.headerContainer}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <View style={styles.headerText}>
            <Text style={styles.authorName}>
              {authorName} {item.id}
            </Text>
            <Text style={styles.timestamp}>{timestamp}</Text>
          </View>
        </View>

        <Text style={styles.itemTitle}>Item #{item.id}</Text>
        <Text style={styles.itemBody}>{randomText}</Text>
        <View style={styles.itemFooter}>
          <Text style={styles.footerText}>❤️ 42</Text>
          <Text style={styles.footerText}>💬 12</Text>
          <Text style={styles.footerText}>🔄 8</Text>
        </View>
      </View>
    </View>
  );
});

export const renderItem = (props: LegendListRenderItemProps<Item>) => (
  <ItemCard {...props} />
);

const styles = StyleSheet.create({
  itemOuterContainer: {
    padding: 12,
  },
  itemContainer: {
    overflow: 'hidden',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  itemBody: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    // flex: 1,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerText: {
    fontSize: 14,
    color: '#888888',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  timestamp: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
});

export default renderItem;
