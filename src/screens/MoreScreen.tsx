import { Alert, StyleSheet, View } from 'react-native';
import {
  BooleanSettings,
  SelectSettings,
} from '../redux/reducers/settingsReducer';
import { Divider, Icon, Layout, List, ListItem } from '@ui-kitten/components';
import React, { useCallback } from 'react';

import { AdUnit } from '../utils/ads';
import ListItemAds from '../components/settings/ListItemAds';
import ListItemTheme from '../components/settings/ListItemTheme';
import ListItemToggle from '../components/settings/ListItemToggle';
import { MoreParamList } from '../utils/types';
import PotentialAd from '../components/shared/PotentialAd';
import { StackNavigationProp } from '@react-navigation/stack';
import { resetApp } from '../redux/actions';
import { useAppDispatch } from '../redux/store';

type Props = {
  navigation: StackNavigationProp<MoreParamList, 'Settings'>;
};

type ListItemNav = { label: string; destination: keyof MoreParamList };
type ListItemAction = { label: string; action: () => void };
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

  const resetAppAlert = useCallback(() => {
    Alert.alert(
      'Are you sure?',
      'This will clear all saved flows. You cannot undo this action.',
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
    | ListItemBooleanSetting
  )[] = [
    { label: 'About', destination: 'About' },
    { label: 'Reset', action: resetAppAlert },
  ];
  const lastNavListItem = listItems.length - 1;

  const selectables: (keyof SelectSettings)[] = ['theme', 'ads'];
  const booleans: (keyof BooleanSettings)[] = ['hideDescription'];

  booleans.forEach((setting) => listItems.push({ setting, isBoolean: true }));
  selectables.forEach((setting) =>
    listItems.push({ setting, isBoolean: false })
  );

  const getListItem = (
    listItem:
      | ListItemNav
      | ListItemSelectSetting
      | ListItemAction
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
    } else {
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
    }
  };

  return (
    <Layout style={styles.container}>
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
