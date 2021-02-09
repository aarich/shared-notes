import * as eva from '@eva-design/eva';

import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';

import BottomTabNavigator from './BottomTabNavigator';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import LinkingConfiguration from './LinkingConfiguration';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { rootNavRef } from './rootNavRef';
import { default as theme } from '../../../assets/theme.json';
import useColorScheme from '../../hooks/useColorScheme';

export default function Navigation() {
  const colorScheme = useColorScheme();

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      ref={rootNavRef}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        {...eva}
        theme={{
          ...(colorScheme === 'dark' ? eva.dark : eva.light),
          ...theme,
        }}
      >
        <BottomTabNavigator />
      </ApplicationProvider>
    </NavigationContainer>
  );
}
