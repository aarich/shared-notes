import * as Linking from 'expo-linking';

import { Icon, useTheme } from '@ui-kitten/components';
import { MoreParamList, NotesParamList } from '../../utils/types';
import React, { useCallback, useEffect } from 'react';

import AboutScreen from '../AboutScreen';
import EditScreen from '../EditScreen';
import LibraryScreen from '../LibraryScreen';
import MoreScreen from '../MoreScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { navigateToEdit } from './rootNavRef';

type BottomTabParamList = {
  Notes: undefined;
  More: undefined;
};

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

type TabBarIconProps = {
  color: string;
  focused: boolean;
  size: number;
};

export default function BottomTabNavigator() {
  const theme = useTheme();

  const handleURL = useCallback(
    (url: string) => {
      const parsed = Linking.parse(url);
      if (parsed.hostname === 'edit' && parsed.path) {
        navigateToEdit(parsed.path);
      }
    },
    [navigateToEdit]
  );

  useEffect(() => {
    Linking.getInitialURL().then((initialUrl) => {
      initialUrl && handleURL(initialUrl);
    });

    const handleUrlEvent = (e: Linking.EventType) => handleURL(e.url);
    Linking.addEventListener('url', handleUrlEvent);
    return () => Linking.removeEventListener('url', handleUrlEvent);
  }, []);

  return (
    <BottomTab.Navigator
      initialRouteName="Notes"
      tabBarOptions={{
        activeTintColor: theme['color-primary-500'],
        labelPosition: 'below-icon',
      }}
    >
      <BottomTab.Screen
        name="Notes"
        component={NotesNavigator}
        options={{
          tabBarIcon: ({ color, focused, size }: TabBarIconProps) => (
            <Icon
              name={`clock${focused ? '' : '-outline'}`}
              fill={color}
              style={{ width: size, height: size }}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="More"
        component={MoreNavigator}
        options={{
          tabBarIcon: ({ color, focused, size }: TabBarIconProps) => (
            <Icon
              name={`more-horizontal${focused ? '' : '-outline'}`}
              fill={color}
              style={{ width: size, height: size }}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

const NotesStack = createStackNavigator<NotesParamList>();

function NotesNavigator() {
  return (
    <NotesStack.Navigator initialRouteName="Library">
      <NotesStack.Screen name="Library" component={LibraryScreen} />
      <NotesStack.Screen name="EditScreen" component={EditScreen} />
    </NotesStack.Navigator>
  );
}

const MoreStack = createStackNavigator<MoreParamList>();

function MoreNavigator() {
  return (
    <MoreStack.Navigator>
      <MoreStack.Screen
        name="Settings"
        component={MoreScreen}
        options={{ headerTitle: 'Options' }}
      />
      <MoreStack.Screen name="About" component={AboutScreen} />
    </MoreStack.Navigator>
  );
}
