export enum AdUnit {
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

export const getAdId = (location: AdUnit) => AD_UNIT[location];
