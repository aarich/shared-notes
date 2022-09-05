/* eslint-disable react/no-unused-prop-types */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon, useTheme } from '@ui-kitten/components';
import * as Linking from 'expo-linking';
import { useCallback, useEffect } from 'react';
import {
  BottomTabParamList,
  MoreParamList,
  NotesParamList,
} from '../../utils/types';
import AboutScreen from '../AboutScreen';
import EditScreenContainer from '../EditScreenContainer';
import FeedbackScreen from '../FeedbackScreen';
import LibraryScreen from '../LibraryScreen';
import MoreScreen from '../MoreScreen';
import { navigateToEdit } from './rootNavRef';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

type TabBarIconProps = {
  color: string;
  focused: boolean;
  size: number;
};

export default function BottomTabNavigator() {
  const theme = useTheme();

  const handleURL = useCallback((url: string) => {
    const parsed = Linking.parse(url);
    if (parsed.hostname === 'edit' && parsed.path) {
      navigateToEdit(parsed.path);
    }
  }, []);

  useEffect(() => {
    Linking.getInitialURL().then((initialUrl) => {
      initialUrl && handleURL(initialUrl);
    });

    const handleUrlEvent = (e: Linking.EventType) => handleURL(e.url);
    const subscription = Linking.addEventListener('url', handleUrlEvent);
    return () => subscription.remove();
  }, [handleURL]);

  return (
    <BottomTab.Navigator
      initialRouteName="Notes"
      screenOptions={{
        tabBarActiveTintColor: theme['color-primary-500'],
        tabBarLabelPosition: 'below-icon',
        headerShown: false,
      }}
    >
      <BottomTab.Screen
        name="Notes"
        component={NotesNavigator}
        options={{
          tabBarIcon: ({ color, focused, size }: TabBarIconProps) => (
            <Icon
              name={`file-text${focused ? '' : '-outline'}`}
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
              name={`options-2${focused ? '' : '-outline'}`}
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
      <NotesStack.Screen name="EditScreen" component={EditScreenContainer} />
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
      <MoreStack.Screen name="Feedback" component={FeedbackScreen} />
    </MoreStack.Navigator>
  );
}
