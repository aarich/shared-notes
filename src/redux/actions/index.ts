import { AnySetting, SettingsState } from '../reducers/settingsReducer';
import {
  AppActionTypes,
  DELETE_NOTE,
  NoteActionTypes,
  RESET,
  SET_NOTE,
  SET_SETTINGS,
  SettingsActionTypes,
  UPDATE_SETTING,
} from './actionTypes';

import { Note } from '../../utils/types';

export const resetApp = (): AppActionTypes => ({ type: RESET });

export const setNote = (note: Note): NoteActionTypes => ({
  type: SET_NOTE,
  payload: note,
});

export const removeNote = (slug: string): NoteActionTypes => ({
  type: DELETE_NOTE,
  payload: slug,
});

export const setSettings = (settings: SettingsState): SettingsActionTypes => ({
  type: SET_SETTINGS,
  payload: settings,
});
export const updateSetting = (update: AnySetting): SettingsActionTypes => ({
  type: UPDATE_SETTING,
  payload: update,
});
