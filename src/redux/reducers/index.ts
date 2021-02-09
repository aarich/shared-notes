import { combineReducers } from 'redux';
import notes from './notesReducer';
import settings from './settingsReducer';

const rootReducer = combineReducers({
  settings,
  notes,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
