import { StackNavigationProp } from '@react-navigation/stack';
import {
  Divider,
  Icon,
  Layout,
  List,
  ListItem,
  Text,
  TopNavigationAction,
} from '@ui-kitten/components';
import { AdMobInterstitial } from 'expo-ads-admob';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Share, StyleSheet, View } from 'react-native';
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
import { AdUnit, getAdId } from '../utils/ads';
import { useUpToDateBridgeData } from '../utils/bridge';
import { MoreParamList } from '../utils/types';

type Props = {
  navigation: StackNavigationProp<MoreParamList, 'Settings'>;
};

type ListItemNav = {
  label: string;
  description?: string;
  destination: keyof MoreParamList;
};
type ListItemAction = {
  label: string;
  description?: string;
  action: () => void;
};
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

  useEffect(() => {
    const url =
      'https://apps.apple.com/app/apple-store/id1552960395?pt=117925864&ct=inappshare&mt=8';
    navigation.setOptions({
      headerRight: () => (
        <TopNavigationAction
          icon={(props) => <Icon {...props} name="share" />}
          onPress={() => Share.share({ url })}
        />
      ),
    });
  }, [navigation]);

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

  const showAd = useCallback(async () => {
    await AdMobInterstitial.setAdUnitID(getAdId(AdUnit.settingsInterstitial));
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: false });
    await AdMobInterstitial.showAdAsync();
  }, []);

  const listItems: (
    | ListItemNav
    | ListItemSelectSetting
    | ListItemAction
    | ListItemColor
    | ListItemBooleanSetting
    | string
  )[] = [
    { label: 'About', destination: 'About' },
    { label: 'Feedback', destination: 'Feedback' },
    { label: 'Reset', action: resetAppAlert },
    {
      label: 'Support the developer',
      description: 'View a brief ad',
      action: showAd,
    },
  ];

  listItems.push('Widget Settings');

  const selectables: (keyof SelectSettings)[] = ['theme', 'ads'];
  const booleans: (keyof BooleanSettings)[] = ['showLastModified', 'showTitle'];

  booleans.forEach((setting) => listItems.push({ setting, isBoolean: true }));

  listItems.push({
    label: 'Widget Color',
  });

  listItems.push('App Settings');

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
      | ListItemBooleanSetting
      | string
  ) => {
    if (typeof listItem === 'string') {
      return (
        <Text category="h6" style={styles.sectionLabel}>
          {listItem}
        </Text>
      );
    } else if ('setting' in listItem) {
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
            description={listItem.description}
            onPress={
              'destination' in listItem
                ? () => navigation.push(listItem.destination)
                : listItem.action
            }
            accessoryRight={(props) => (
              <Icon {...props} name="chevron-right-outline" />
            )}
          />
        </>
      );
    } else {
      // It's color
      return (
        <ListItem
          title={listItem.label}
          description="Background color of the widget"
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
        renderItem={({ item }) => getListItem(item)}
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
  sectionLabel: { padding: 14 },
});

export default MoreScreen;
