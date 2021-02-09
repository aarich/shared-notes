import { StyleSheet, View } from 'react-native';

import React from 'react';
import { Text } from '@ui-kitten/components';

type Props = {
  title: string;
  subtitle: string;
  graphic?: JSX.Element;
};

const TutorialScreen = ({ title, subtitle = '', graphic }: Props) => {
  return (
    <View style={{ flex: 1, margin: '5%' }}>
      <View style={localStyles.title}>
        <Text category="h1">{title}</Text>
      </View>
      {graphic ? (
        <View style={localStyles.image}>{graphic}</View>
      ) : (
        <View style={localStyles.noImage}></View>
      )}
      <View style={localStyles.subtitle}>
        <Text category="s1" style={localStyles.subtitleText}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
};

export default TutorialScreen;
const localStyles = StyleSheet.create({
  title: {
    flex: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImage: {
    flex: 4,
  },
  image: {
    flex: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    flex: 20,
    textAlign: 'center',
  },
  subtitleText: {
    textAlign: 'center',
  },
});
