import { produce } from 'immer';
import { AnyAction } from 'redux';
import { Note } from '../../utils/types';
import { removeNote, resetApp, setNote } from '../actions';

export type NotesState = { [slug: string]: Note };

export const initialState: NotesState = {};

const reducer = (
  state: NotesState = initialState,
  action: AnyAction
): NotesState =>
  produce(state, (draft) => {
    if (setNote.match(action)) {
      draft[action.payload.slug] = action.payload;
    } else if (removeNote.match(action)) {
      delete draft[action.payload];
    } else if (resetApp.match(action)) {
      return initialState;
    }
  });

export default reducer;
