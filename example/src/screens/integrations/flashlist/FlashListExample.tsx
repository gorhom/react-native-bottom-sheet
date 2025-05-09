import BottomSheet, { BottomSheetFlashList } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  type ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
  type ViewabilityConfig,
} from 'react-native';
import { Button } from '../../../components/button';
import TweetContent from './TweetContent';
import { tweets as tweetsData } from './data/tweets';
import type Tweet from './models/Tweet';

const keyExtractor = (item: Tweet) => {
  return item.id;
};

const snapPoints = ['25%', '50%', '90%'];

const FlashListExample = () => {
  //#region state
  const [tweets, setTweets] = useState(tweetsData);
  //#endregion

  //#region refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const remainingTweets = useRef([...tweetsData].splice(10, tweetsData.length));
  const viewabilityConfig = useRef<ViewabilityConfig>({
    waitForInteraction: true,
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 1000,
  }).current;
  //#endregion

  const handleOnEndReached = useCallback(() => {
    setTimeout(() => {
      setTweets([...tweets, ...remainingTweets.current.splice(0, 10)]);
    }, 1000);
  }, [tweets]);
  const handleSnapPress = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);
  const handleExpandPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  const handleCollapsePress = useCallback(() => {
    bottomSheetRef.current?.collapse();
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  //#region render
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Tweet>) => <TweetContent tweet={item} />,
    []
  );
  const renderFooter = useMemo(
    () => <Footer isLoading={tweets.length !== tweetsData.length} />,
    [tweets]
  );
  return (
    <View style={styles.container}>
      <Button label="Snap To 90%" onPress={() => handleSnapPress(2)} />
      <Button label="Snap To 50%" onPress={() => handleSnapPress(1)} />
      <Button label="Snap To 25%" onPress={() => handleSnapPress(0)} />
      <Button label="Expand" onPress={handleExpandPress} />
      <Button label="Collapse" onPress={handleCollapsePress} />
      <Button label="Close" onPress={handleClosePress} />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
      >
        <BottomSheetFlashList
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={handleOnEndReached}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={Empty}
          estimatedItemSize={150}
          ItemSeparatorComponent={Divider}
          data={tweets}
          viewabilityConfig={viewabilityConfig}
        />
      </BottomSheet>
    </View>
  );
  //#endregion
};

const Divider = () => {
  return <View style={styles.divider} />;
};

const Footer = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <View style={styles.footer}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Text style={styles.footerTitle}>No more tweets</Text>
      )}
    </View>
  );
};

const Empty = () => {
  const title = 'Welcome to your timeline';
  const subTitle =
    "It's empty now but it won't be for long. Start following peopled you'll see Tweets show up here";
  return (
    <View style={styles.emptyComponent} testID="EmptyComponent">
      <Text style={styles.emptyComponentTitle}>{title}</Text>
      <Text style={styles.emptyComponentSubtitle}>{subTitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#DDD',
  },
  header: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1DA1F2',
  },
  footer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    padding: 8,
    borderRadius: 12,
    fontSize: 12,
  },
  footerTitle: {
    padding: 8,
    borderRadius: 12,
    fontSize: 12,
  },
  emptyComponentTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyComponentSubtitle: {
    color: '#808080',
    padding: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyComponent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default FlashListExample;
