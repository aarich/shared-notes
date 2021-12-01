export const enum AdUnit {
  library = 'library',
  settings = 'settings',
  settingsInterstitial = 'settingsInterstitial',
  edit = 'edit',
}

const AD_UNIT = {
  library: 'ca-app-pub-6949812709353975/6427824702',
  settings: 'ca-app-pub-6949812709353975/8487189445',
  settingsInterstitial: 'ca-app-pub-6949812709353975/6967060610',
  edit: 'ca-app-pub-6949812709353975/5088560986',
};

const TEST_AD_ID = 'ca-app-pub-3940256099942544/6300978111';
const TEST_AD_INT_ID = 'ca-app-pub-3940256099942544/4411468910';

const getTestAdId = (location: AdUnit) =>
  location === AdUnit.settingsInterstitial ? TEST_AD_INT_ID : TEST_AD_ID;

export const getAdId = (location: AdUnit) =>
  __DEV__ ? getTestAdId(location) : AD_UNIT[location];
