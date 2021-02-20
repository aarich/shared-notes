import { Alert, AlertButton, Platform, Share } from 'react-native';

import { AppDispatch } from '../redux/store';
import Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import { Note } from './types';
import { deleteNote } from '../redux/actions/thunks';
import { removeNote } from '../redux/actions';

export const VERSION = `${Constants.nativeAppVersion}-${Constants.manifest.extra.MyVersion}`;

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
        text: 'Delete for everyone',
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
  if (!/^[a-z0-9-]+$/i.test(slug)) {
    throw new Error(
      'Invalid slug! Must be alphanumeric with hyphens anywhere.'
    );
  }
};

export const showInfoAlert = (content: string, isNew: boolean) => {
  const infoButtons: AlertButton[] | undefined = isNew
    ? undefined
    : [
        {
          text: 'Copy Note to Clipboard',
          onPress: () => Clipboard.setString(content),
        },
        { text: 'Cancel', style: 'cancel' },
      ];
  const secureMsg =
    'Anyone who can guess the slug is able to view, edit, or delete this note, so do not enter any private or secure information.';
  const message = isNew
    ? 'Choose a name, slug, and enter content for the note. '
    : 'You can edit the name or content of this note!';
  Alert.alert('Info', message + '\n\n' + secureMsg, infoButtons);
};

export const noteSavedMessage = (isNew: boolean) =>
  Alert.alert(
    'Note Saved',
    `To add it to a your home screen, press and hold the widget, then tap "Edit Widget" to choose a note.${
      isNew
        ? ''
        : '\n\nOther devices displaying this note will be updated soon!'
    }`
  );

export const copyWithConfirm = (textToCopy: string) =>
  Alert.alert('Copy to Clipboard?', textToCopy, [
    {
      text: 'Copy',
      onPress: () => Clipboard.setString(textToCopy || ''),
    },
    {
      text: 'Cancel',
      style: 'cancel',
    },
  ]);

export const checkDiscard = (
  onYes: () => void,
  text: string,
  discardText?: string
) =>
  Alert.alert(
    'Discard changes?',
    'You may have unsaved changes. This will discard those changes.',
    [
      { text, style: 'cancel' },
      {
        text: discardText || 'Discard',
        style: 'destructive',
        onPress: onYes,
      },
    ]
  );
