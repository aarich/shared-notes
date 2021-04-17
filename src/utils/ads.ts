export enum AdUnit {
  library = 'library',
  settings = 'settings',
  edit = 'edit',
}

const AD_UNIT = {
  library: 'ca-app-pub-6949812709353975/6427824702',

  settings: 'ca-app-pub-6949812709353975/8487189445',

  edit: 'ca-app-pub-6949812709353975/5088560986',
};

const TEST_ADD_ID = 'ca-app-pub-3940256099942544/6300978111';

export const getAdId = (location: AdUnit) => {
  return __DEV__ ? TEST_ADD_ID : AD_UNIT[location];
};
