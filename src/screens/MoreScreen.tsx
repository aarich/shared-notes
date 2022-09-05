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
import { useCallback, useEffect, useState } from 'react';
import { Alert, Share, StyleSheet, View } from 'react-native';
import ColorPicker from '../components/settings/ColorPicker';
import ListItemAds from '../components/settings/ListItemAds';
import ListItemTheme from '../components/settings/ListItemTheme';
import ListItemToggle from '../components/settings/ListItemToggle';
import PotentialAd from '../components/shared/PotentialAd';
import { resetApp, updateSetting } from '../redux/actions';
import { useSetting } from '../redux/selectors';
import { useAppDispatch } from '../redux/store';
import { AdUnit, getAdId } from '../utils/ads';
import { useUpToDateBridgeData } from '../utils/bridge';
import { MoreParamList } from '../utils/types';

type Props = {
  navigation: StackNavigationProp<MoreParamList, 'Settings'>;
};

const renderNavigation = (
  navigation: Props['navigation'],
  destination: keyof MoreParamList,
  description?: string
) => (
  <ListItem
    title={destination}
    description={description}
    onPress={() => navigation.push(destination)}
    accessoryRight={(props) => <Icon {...props} name="chevron-right-outline" />}
  />
);

const renderAction = (
  label: string,
  onPress: VoidFunction,
  description?: string,
  icon = 'chevron-right-outline'
) => (
  <ListItem
    title={label}
    description={description}
    onPress={onPress}
    accessoryRight={(props) => <Icon {...props} name={icon} />}
  />
);

const renderHeader = (heading: string) => (
  <Text category="h6" style={styles.sectionLabel}>
    {heading}
  </Text>
);

const renderWidgetColorListItem = (color: string, onPress: VoidFunction) => (
  <ListItem
    title="Widget Color"
    description="Background color of the widget"
    onPress={onPress}
    accessoryRight={(props) => (
      <View style={styles.padding}>
        <Icon {...props} name="checkmark-circle-2" fill={color} />
      </View>
    )}
  />
);

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

  const listItems: (() => React.ReactElement)[] = [
    () => renderNavigation(navigation, 'About'),
    () => renderNavigation(navigation, 'Feedback'),
    () =>
      renderAction('Support the developer', showAd, 'View a brief ad', 'heart'),
    () => renderHeader('Widget Settings'),
    () => <ListItemToggle setting="showLastModified" />,
    () => <ListItemToggle setting="showTitle" />,
    () => renderWidgetColorListItem(color, () => setIsColorPickerVisible(true)),
    () => renderHeader('App Settings'),
  ];

  if ((useSetting('ignoredInfos')?.length ?? 0) > 0) {
    listItems.push(() =>
      renderAction(
        'Reset Walkthrough',
        () => dispatch(updateSetting({ ignoredInfos: [] })),
        'Start over with the "help" messages',
        'question-mark-outline'
      )
    );
  }

  listItems.push(
    () => <ListItemAds />,
    () => <ListItemTheme />,
    () => renderAction('Reset', resetAppAlert, undefined, 'flip-2-outline')
  );

  const [bridgeError, setBridgeError] = useUpToDateBridgeData();
  useEffect(() => {
    if (bridgeError) {
      Alert.alert('Error', bridgeError);
      setBridgeError(undefined);
    }
  }, [bridgeError, setBridgeError]);

  return (
    <Layout style={styles.container}>
      <ColorPicker
        visible={isColorPickerVisible}
        onDismiss={() => setIsColorPickerVisible(false)}
      />
      <List
        style={styles.list}
        ItemSeparatorComponent={Divider}
        data={listItems}
        keyExtractor={(_, i) => `${i}`}
        renderItem={({ item: render }) => render()}
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
  sectionLabel: { padding: 14 },
  padding: { paddingRight: 10 },
  list: { flex: 1, width: '100%' },
});

export default MoreScreen;
