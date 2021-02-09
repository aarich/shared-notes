import { AnySetting, SettingsState } from '../reducers/settingsReducer';

import { Note } from '../../utils/types';

export const RESET = 'RESET';

export const SET_NOTE = 'SET_NOTE';
export const DELETE_NOTE = 'DELETE_NOTE';

export const SET_SETTINGS = 'SET_SETTINGS';
export const UPDATE_SETTING = 'UPDATE_SETTING';

interface ResetAction {
  type: typeof RESET;
}

interface SetNoteAction {
  type: typeof SET_NOTE;
  payload: Note;
}

interface DeleteNoteAction {
  type: typeof DELETE_NOTE;
  payload: string;
}

interface SetSettingsAction {
  type: typeof SET_SETTINGS;
  payload: SettingsState;
}
interface UpdateSettingsAction {
  type: typeof UPDATE_SETTING;
  payload: AnySetting;
}

export type AppActionTypes = ResetAction;
export type NoteActionTypes = SetNoteAction | DeleteNoteAction;
export type SettingsActionTypes = SetSettingsAction | UpdateSettingsAction;
