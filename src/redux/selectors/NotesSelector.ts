import { NotesState } from '../reducers/notesReducer';
import { useSelector } from 'react-redux';

interface RootState {
  notes: NotesState;
}

export const useNotes = () =>
  Object.values(useSelector((state: RootState) => state.notes));

export const useNote = (slug?: string) =>
  useSelector((state: RootState) => (slug ? state.notes[slug] : undefined));
