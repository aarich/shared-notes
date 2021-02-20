import * as StoreReview from 'expo-store-review';

import { Button, Icon, Layout, Text } from '@ui-kitten/components';
import { Platform, StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { VERSION } from '../utils/experience';
import { openURL } from 'expo-linking';

const baseMainURL = 'https://mrarich.com';

const getContactUrl = (message: string) =>
  `${baseMainURL}/contact${message ? '?m=' + message : ''}`;

const makeButton = (title: string, icon: string, onPress: () => void) => (
  <View style={{ width: '100%', paddingTop: 8 }}>
    <Button
      size="giant"
      appearance="ghost"
      accessoryLeft={(props) => <Icon {...props} name={icon} />}
      onPress={onPress}
    >
      {title}
    </Button>
  </View>
);

const FeedbackScreen = () => {
  const issuesUrl = 'https://github.com/aarich/shared-notes/issues/new';
  const storeUrl =
    Platform.OS === 'ios'
      ? 'https://apps.apple.com/app/apple-store/id1552960395?pt=117925864&ct=inappfeedback&mt=8'
      : '';
  const app = Platform.OS === 'ios' ? 'App' : 'Play';

  useEffect(() => {
    const today = new Date();

    if (today.getDate() === 1) {
      StoreReview.isAvailableAsync()
        .then((available) => {
          if (available) {
            AsyncStorage.getItem('REVIEW').then((val) => {
              if (!val) {
                AsyncStorage.setItem('REVIEW', 'asked');
                StoreReview.requestReview();
              }
            });
          }
        })
        .catch(console.log);
    }
  }, []);

  return (
    <Layout style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text category="h6" style={styles.descText}>
          How are you using this app? Have a bug to report? Want to share the
          app with others?
        </Text>
        <View>
          {storeUrl ? (
            makeButton(`Open in the ${app} Store`, 'bulb-outline', () =>
              openURL(storeUrl)
            )
          ) : (
            <></>
          )}
          {makeButton('Contact Directly', 'message-circle-outline', () =>
            openURL(getContactUrl(`Feedback for Notes (${VERSION}): `))
          )}
          {makeButton('Send Bug Report', 'github-outline', () =>
            openURL(issuesUrl)
          )}
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descText: {
    textAlign: 'center',
    paddingTop: 10,
    paddingHorizontal: 40,
    paddingBottom: 50,
  },
});

export default FeedbackScreen;
