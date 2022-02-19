import { AnyAction } from 'redux';
import theme from '../../../assets/theme.json';
import { InfoAlert } from '../../utils/types';
import { ignoreInfo, resetApp, setSettings, updateSetting } from '../actions';
export enum AdType {
  /** @deprecated since ios 14.5 */
  Personal = 'Personal',
  /** @deprecated since ios 14.5 */
  Generic = 'Generic',
  Off = 'Off',
  On = 'On',
}

export enum ThemeType {
  Light = 'Light',
  Dark = 'Dark',
  System = 'System',
}

// Select
type adSetting = { ads: AdType };
type themeSetting = { theme: ThemeType };
// Boolean
type showTitle = { showTitle: boolean };
type showLastModified = { showLastModified: boolean };
// other
type adLastResetSetting = { adLastReset: number };
type widgetColor = { widgetColor: string };
// For the "Dont' show me this again option"
type ignoredInfos = { ignoredInfos?: InfoAlert[] };

export type AnySetting =
  | adSetting
  | themeSetting
  | showTitle
  | showLastModified
  | adLastResetSetting
  | widgetColor
  | ignoredInfos;

export type BooleanSettings = showTitle & showLastModified;

export type SelectSettings = adSetting & themeSetting;

export type SettingsState = SelectSettings &
  BooleanSettings &
  adLastResetSetting &
  widgetColor &
  ignoredInfos;

export const initialState: SettingsState = {
  ads: AdType.On,
  theme: ThemeType.System,
  showTitle: true,
  showLastModified: true,
  widgetColor: theme['color-primary-500'],
  adLastReset: Date.now(),
  ignoredInfos: [],
};

const reducer = (
  state: SettingsState = initialState,
  action: AnyAction
): SettingsState => {
  if (setSettings.match(action)) {
    return action.payload;
  } else if (updateSetting.match(action)) {
    if ('ads' in action.payload) {
      return { ...state, ...action.payload, adLastReset: Date.now() };
    }
    return { ...state, ...action.payload };
  } else if (ignoreInfo.match(action)) {
    const ignoredInfos = [...(state.ignoredInfos || []), action.payload];
    return { ...state, ignoredInfos };
  } else if (resetApp.match(action)) {
    return initialState;
  } else {
    return state;
  }
};

export default reducer;
