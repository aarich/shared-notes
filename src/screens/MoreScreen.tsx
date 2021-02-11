import { StackNavigationProp } from '@react-navigation/stack';
import { Divider, Icon, Layout, List, ListItem } from '@ui-kitten/components';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import ColorPicker from '../components/settings/ColorPicker';
import ListItemAds from '../components/settings/ListItemAds';
import ListItemTheme from '../components/settings/ListItemTheme';
import ListItemToggle from '../components/settings/ListItemToggle';
import PotentialAd from '../components/shared/PotentialAd';
import { resetApp } from '../redux/actions';
import {
  BooleanSettings,
  SelectSettings,
} from '../redux/reducers/settingsReducer';
import { useSetting } from '../redux/selectors';
import { useAppDispatch } from '../redux/store';
import { AdUnit } from '../utils/ads';
import { useUpToDateBridgeData } from '../utils/bridge';
import { MoreParamList } from '../utils/types';

type Props = {
  navigation: StackNavigationProp<MoreParamList, 'Settings'>;
};

type ListItemNav = { label: string; destination: keyof MoreParamList };
type ListItemAction = { label: string; action: () => void };
type ListItemColor = { label: string };
type ListItemBooleanSetting = {
  setting: keyof BooleanSettings;
  isBoolean: true;
};
type ListItemSelectSetting = {
  setting: keyof SelectSettings;
  isBoolean: false;
};

const MoreScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const color = useSetting('widgetColor');

  const resetAppAlert = useCallback(() => {
    Alert.alert(
      'Are you sure?',
      "This will clear all notes from this device, but it won't delete them from the server.",
      [
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            dispatch(resetApp());
          },
        },
        {
          text: 'Cancel',
        },
      ]
    );
  }, [dispatch]);

  const listItems: (
    | ListItemNav
    | ListItemSelectSetting
    | ListItemAction
    | ListItemColor
    | ListItemBooleanSetting
  )[] = [
    { label: 'About', destination: 'About' },
    { label: 'Feedback', destination: 'Feedback' },
    { label: 'Reset', action: resetAppAlert },
  ];
  const lastNavListItem = listItems.length - 1;

  const selectables: (keyof SelectSettings)[] = ['theme', 'ads'];
  const booleans: (keyof BooleanSettings)[] = ['showLastModified', 'showTitle'];

  booleans.forEach((setting) => listItems.push({ setting, isBoolean: true }));
  listItems.push({
    label: 'Widget Color',
  });
  selectables.forEach((setting) =>
    listItems.push({ setting, isBoolean: false })
  );

  const [bridgeError, setBridgeError] = useUpToDateBridgeData();
  useEffect(() => {
    if (bridgeError) {
      Alert.alert('Error', bridgeError);
      setBridgeError(undefined);
    }
  }, [bridgeError, setBridgeError]);

  const getListItem = (
    listItem:
      | ListItemNav
      | ListItemSelectSetting
      | ListItemAction
      | ListItemColor
      | ListItemBooleanSetting,
    index: number
  ) => {
    if ('setting' in listItem) {
      if (listItem.isBoolean) {
        return <ListItemToggle setting={listItem.setting} />;
      } else {
        const Comp: () => JSX.Element = {
          ads: ListItemAds,
          theme: ListItemTheme,
        }[listItem.setting];
        return <Comp />;
      }
    } else if ('action' in listItem || 'destination' in listItem) {
      return (
        <>
          <ListItem
            title={listItem.label}
            onPress={
              'destination' in listItem
                ? () => navigation.push(listItem.destination)
                : listItem.action
            }
            accessoryRight={(props) => (
              <Icon {...props} name="chevron-right-outline" />
            )}
          />
          {index === lastNavListItem ? (
            <View style={{ height: 20 }}></View>
          ) : null}
        </>
      );
    } else {
      // It's color
      return (
        <ListItem
          title={listItem.label}
          onPress={() => setIsColorPickerVisible(true)}
          accessoryRight={(props) => (
            <View style={{ paddingRight: 10 }}>
              <Icon {...props} name="checkmark-circle-2" fill={color} />
            </View>
          )}
        />
      );
    }
  };

  return (
    <Layout style={styles.container}>
      <ColorPicker
        visible={isColorPickerVisible}
        onDismiss={() => setIsColorPickerVisible(false)}
      />
      <List
        style={{ flex: 1, width: '100%' }}
        ItemSeparatorComponent={Divider}
        data={listItems}
        keyExtractor={(_, i) => '' + i}
        renderItem={({ item, index }) => getListItem(item, index)}
      />
      <PotentialAd unit={AdUnit.settings} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

export default MoreScreen;
