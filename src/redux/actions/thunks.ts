import { Note, NoteDraft } from '../../utils/types';
import { removeNote, setNote } from '.';

import { AppThunk } from '../store';

const noteEndpoint = 'https://projects.mrarich.com/notes/api/note';

const checkResponse = (resp: Response) => {
  if (!resp.ok) {
    throw new Error(resp.statusText);
  }
  return resp.json().then((resp) => {
    if (!resp.success) {
      throw new Error(resp.message);
    }
    return resp;
  });
};

export const getNote = (slug: string): AppThunk<Note> => (dispatch) =>
  fetch(`${noteEndpoint}?slug=${slug}`)
    .then(checkResponse)
    .then((resp) => {
      const fetched = { ...resp.note, slug };
      dispatch(setNote(fetched));
      return fetched;
    });

export const postNote = (note: NoteDraft): AppThunk<Note> => (dispatch) =>
  fetch(noteEndpoint, {
    method: 'POST',
    body: JSON.stringify(note),
  })
    .then(checkResponse)
    .then((resp) => {
      const created = { ...note, ...resp.note };
      dispatch(setNote(created));
      return created;
    });

export const patchNote = (note: NoteDraft): AppThunk<Note> => (dispatch) =>
  fetch(noteEndpoint, {
    method: 'PATCH',
    body: JSON.stringify(note),
  })
    .then(checkResponse)
    .then((resp) => {
      const updated = { ...note, created: '', modified: '' };
      dispatch(setNote(updated));
      return updated;
    });

export const deleteNote = (
  slug: string,
  deleteFromDB: boolean
): AppThunk<void> => async (dispatch) => {
  if (deleteFromDB) {
    await fetch(noteEndpoint, {
      method: 'DELETE',
      body: JSON.stringify({ slug }),
    })
      .then(checkResponse)
      .then(() => {
        dispatch(removeNote(slug));
      });
  } else {
    dispatch(removeNote(slug));
  }
};
