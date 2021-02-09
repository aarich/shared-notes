import { Platform } from 'react-native';

export enum AdUnit {
  library = 'library',
  settings = 'settings',
}

const AD_UNIT = {
  library: {
    ios: '',
    android: '',
  },
  settings: {
    ios: '',
    android: '',
  },
};

const TEST_ADD_ID = 'ca-app-pub-3940256099942544/6300978111';

export const getAdId = (location: AdUnit) => {
  const platformStr = Platform.OS == 'ios' ? 'ios' : 'android';
  return __DEV__ ? TEST_ADD_ID : AD_UNIT[location][platformStr];
};
