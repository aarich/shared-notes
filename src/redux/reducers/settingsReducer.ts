import {
  AppActionTypes,
  RESET,
  SET_SETTINGS,
  SettingsActionTypes,
  UPDATE_SETTING,
} from '../actions/actionTypes';

import theme from '../../../assets/theme.json';

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

export type AnySetting =
  | adSetting
  | themeSetting
  | showTitle
  | showLastModified
  | adLastResetSetting
  | widgetColor;

export type BooleanSettings = showTitle & showLastModified;

export type SelectSettings = adSetting & themeSetting;

export type SettingsState = SelectSettings &
  BooleanSettings &
  adLastResetSetting &
  widgetColor;

export const initialState: SettingsState = {
  ads: AdType.Generic,
  theme: ThemeType.System,
  showTitle: true,
  showLastModified: true,
  widgetColor: theme['color-primary-500'],
  adLastReset: Date.now(),
};

const reducer = (
  state: SettingsState = initialState,
  action: SettingsActionTypes | AppActionTypes
): SettingsState => {
  switch (action.type) {
    case SET_SETTINGS:
      return action.payload;
    case UPDATE_SETTING: {
      if ('ads' in action.payload) {
        return { ...state, ...action.payload, adLastReset: Date.now() };
      }
      return { ...state, ...action.payload };
    }
    case RESET:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
