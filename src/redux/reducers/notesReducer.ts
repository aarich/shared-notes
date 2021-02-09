import {
  AppActionTypes,
  DELETE_NOTE,
  NoteActionTypes,
  RESET,
  SET_NOTE,
} from '../actions/actionTypes';

import { Note } from '../../utils/types';

export type NotesState = { [slug: string]: Note };

export const initialState: NotesState = {};

const reducer = (
  state: NotesState = initialState,
  action: NoteActionTypes | AppActionTypes
): NotesState => {
  switch (action.type) {
    case SET_NOTE:
      return { ...state, [action.payload.slug]: action.payload };
    case DELETE_NOTE: {
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }
    case RESET:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
