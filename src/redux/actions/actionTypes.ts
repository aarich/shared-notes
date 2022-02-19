import { createAction } from '@reduxjs/toolkit';
import { InfoAlert, Note } from '../../utils/types';
import { AnySetting, SettingsState } from '../reducers/settingsReducer';

export const resetApp = createAction('APP/RESET');
export const setSettings = createAction<SettingsState>('APP/SET_SETTINGS');
export const updateSetting = createAction<AnySetting>('APP/UPDATE_SETTING');
export const ignoreInfo = createAction<InfoAlert>('APP/IGNORE_INFO');

export const setNote = createAction<Note>('NOTE/SET');
export const removeNote = createAction<string>('NOTE/REMOVE');
