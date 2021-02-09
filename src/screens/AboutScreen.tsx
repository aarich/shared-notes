import * as Linking from 'expo-linking';

import { Layout, Text } from '@ui-kitten/components';
import { ScrollView, StyleSheet, View } from 'react-native';

import Constants from 'expo-constants';
import React from 'react';

const h3 = (text: string) => (
  <Text category="h3" style={styles.h3}>
    {text}
  </Text>
);
const p = (text: string) => (
  <Text category="p1" style={styles.p}>
    {text}
  </Text>
);
const a = (name: string, url: string) => (
  <Text
    status="primary"
    style={styles.p}
    onPress={() => Linking.openURL('https://' + url)}
  >
    {name}
  </Text>
);

const AboutScreen = () => {
  return (
    <Layout style={{ flex: 1, flexGrow: 1 }}>
      <ScrollView style={{ paddingHorizontal: '5%' }}>
        {h3('Privacy')}
        {p(
          "It's simple: this app does not collect any data unless you explicitly provide it. Notes are stored on our servers, " +
            'however they are not linked to you.' +
            'We use ads, and those ad providers have their own privacy policies.'
        )}
        <Text category="p1" style={styles.p}>
          Visit the developer&apos;s {a('website', 'mrarich.com/privacy')} for
          the full policy.
        </Text>
        {h3('Ads')}
        {p(
          'App stores charge to host apps. As a hobby project this' +
            ' app is supported by ads, but you can disable them at any time. ' +
            'Ads will resume after several days (you can turn them back off), but enjoy the peace in the meantime!'
        )}
        {h3('Acknowledgements')}
        {p(
          'Thanks to the following open source software and free services for making this app possible.'
        )}
        {[
          { name: 'Expo', url: 'expo.io' },
          {
            name: 'QR Code SVG',
            url: 'github.com/awesomejerry/react-native-qrcode-svg',
          },
          {
            name: 'Random Word Slugs',
            url: 'github.com/nas5w/random-word-slugs',
          },
          { name: 'React Native', url: 'reactnative.dev' },
          {
            name: 'Shared Group Preferences',
            url:
              'github.com/KjellConnelly/react-native-shared-group-preferences',
          },
          { name: 'Stack Overflow', url: 'stackoverflow.com' },
          {
            name: 'UI Kitten',
            url: 'akveo.github.io/react-native-ui-kitten',
          },
        ].map((link, i) => (
          <View key={i}>{a(link.name, link.url)}</View>
        ))}
        {h3('Who is building this?')}
        <Text category="p1" style={styles.p}>
          The source code for this app is entirely public! You can browse it and
          if you like, make a contribution! Check it out on{' '}
          {a('GitHub', 'github.com/aarich/shared-notes')}. You can find out more
          about the developer {a('here', 'mrarich.com/about')}.
        </Text>
        {p(
          `Version ${Constants.nativeAppVersion}-${Constants.manifest.extra.MyVersion}`
        )}
        {p(`© ${new Date().getFullYear()} Alex Rich`)}
        <Text></Text>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  h3: { paddingTop: 16 },
  p: { paddingTop: 8 },
});

export default AboutScreen;
