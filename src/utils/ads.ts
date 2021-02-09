import { Platform } from 'react-native';

export enum AdUnit {
  library = 'library',
  settings = 'settings',
  edit = 'edit',
}

const AD_UNIT = {
  library: {
    ios: 'ca-app-pub-6949812709353975/6427824702',
    android: '',
  },
  settings: {
    ios: 'ca-app-pub-6949812709353975/8487189445',
    android: '',
  },
  edit: {
    ios: 'ca-app-pub-6949812709353975/5088560986',
    android: '',
  },
};

const TEST_ADD_ID = 'ca-app-pub-3940256099942544/6300978111';

export const getAdId = (location: AdUnit) => {
  const platformStr = Platform.OS == 'ios' ? 'ios' : 'android';
  return __DEV__ ? TEST_ADD_ID : AD_UNIT[location][platformStr];
};
