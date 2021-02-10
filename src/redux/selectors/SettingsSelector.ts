import { useSelector } from 'react-redux';
import { SettingsState } from '../reducers/settingsReducer';

interface RootState {
  settings: SettingsState;
}

type Setting = keyof SettingsState;

export const useSettings = () =>
  useSelector((state: RootState) => state.settings);

export const useSetting = <T extends Setting>(key: T): SettingsState[T] =>
  useSettings()[key];
