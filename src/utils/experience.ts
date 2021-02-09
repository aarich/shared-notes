import { Alert, Platform, Share } from 'react-native';

import { AppDispatch } from '../redux/store';
import { Note } from './types';
import { deleteNote } from '../redux/actions/thunks';
import { removeNote } from '../redux/actions';

export const sendErrorAlert = (e: Error) => Alert.alert('Error', e.message);

export const deleteNoteAlert = (note: Note, dispatch: AppDispatch) => {
  Alert.alert(
    'Delete Note',
    `Would you like to remove '${note.name}' from this device or erase it from the servers?

Deleting it from the servers means all others will lose access. You cannot undo this.`,
    [
      {
        text: 'Remove from this device only',
        onPress: () => dispatch(removeNote(note.slug)),
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteNote(note.slug)),
      },
      { text: 'Cancel' },
    ]
  );
};

export const shareNote = (slug: string) => {
  const url = getShareLink(slug);
  let content;
  if (Platform.OS === 'ios') {
    content = { url };
  } else {
    content = { message: url, title: 'Flow' };
  }
  Share.share(content);
};

export const getShareLink = (slug: string) =>
  `https://projects.mrarich.com/notes?note=${slug}`;

export const validateSlug = (slug: string) => {
  if (!/^[a-z0-9\-]+$/i.test(slug)) {
    throw new Error(
      'Invalid slug! Must be alphanumeric with hyphens anywhere.'
    );
  }
};
