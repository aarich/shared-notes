import { removeNote, setNote } from '.';
import { Note, NoteDraft } from '../../utils/types';
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

const validateNote = (note: NoteDraft) => {
  const ret = new Promise<void>((resolve) => {
    if (note.name.length === 0 || note.content.length === 0) {
      throw new Error('Note needs a title and content!');
      // return Promise.reject('Note needs a title and content!');
    } else if (note.slug.length < 5) {
      return Promise.reject(
        'Identifier is too short! Must be at least 5 characters.'
      );
    }
    resolve();
  });
  return ret;
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
  validateNote(note)
    .then(() =>
      fetch(noteEndpoint, {
        method: 'POST',
        body: JSON.stringify(note),
      })
    )
    .then(checkResponse)
    .then((resp) => {
      const created = { ...resp.note };
      dispatch(setNote(created));
      return created;
    });

export const patchNote = (note: NoteDraft): AppThunk<[Note, boolean]> => (
  dispatch
) =>
  validateNote(note)
    .then(() =>
      fetch(noteEndpoint, {
        method: 'PATCH',
        body: JSON.stringify(note),
      })
    )
    .then(checkResponse)
    .then((resp) => {
      dispatch(setNote(resp.note));
      return [resp.note, resp.created];
    });

export const deleteNote = (slug: string): AppThunk<void> => (dispatch) =>
  fetch(noteEndpoint, {
    method: 'DELETE',
    body: JSON.stringify({ slug }),
  })
    .then(checkResponse)
    .then(() => {
      dispatch(removeNote(slug));
    });
