import { setString as setClipboardString } from 'expo-clipboard';
import Constants from 'expo-constants';
import { Alert, AlertButton, Share } from 'react-native';
import { ignoreInfo, removeNote } from '../redux/actions';
import { deleteNote } from '../redux/actions/thunks';
import { AppDispatch, store } from '../redux/store';
import { InfoAlert, Note } from './types';

export const VERSION = `${Constants.manifest?.version}-${Constants.manifest?.extra?.MyVersion}`;

export const sendErrorAlert = (e: Error) => Alert.alert('Error', e.message);

export const deleteNoteAlert = (note: Note, dispatch: AppDispatch) => {
  Alert.alert(
    `Delete '${note.name}'`,
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
  Share.share({ url });
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

export const showCheckboxInfoAlert = (isNew: boolean) =>
  Alert.alert(
    'Checkbox Mode',
    isNew
      ? 'Save the note first to enter checkbox mode.'
      : 'Use this mode to quickly remove things from a list.'
  );

const isInfoIgnored = (infoType: InfoAlert): boolean =>
  store.getState().settings.ignoredInfos?.includes(infoType) ?? false;
const ignoreInfoType = (infoType: InfoAlert) => {
  store.dispatch(ignoreInfo(infoType));
};

export const showInfoAlert = (content: string, isNew: boolean) => {
  const infoButtons: AlertButton[] | undefined = isNew
    ? undefined
    : [
        {
          text: 'Copy Note to Clipboard',
          onPress: () => setClipboardString(content),
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

export const noteSavedMessage = (isNew: boolean) => {
  if (isInfoIgnored(InfoAlert.ON_SAVE)) {
    return;
  }
  Alert.alert(
    'Note Saved',
    `To add it to a your home screen, press and hold the widget, then tap "Edit Widget" to choose a note.${
      isNew
        ? ''
        : '\n\nOther devices displaying this note will be updated soon!'
    }`,
    [
      {
        text: "Don't show me this again",
        onPress: () => ignoreInfoType(InfoAlert.ON_SAVE),
      },
      { text: 'Ok' },
    ]
  );
};

export const copyWithConfirm = (textToCopy: string) =>
  Alert.alert('Copy to Clipboard?', textToCopy, [
    {
      text: 'Copy',
      onPress: () => setClipboardString(textToCopy || ''),
    },
    {
      text: 'Cancel',
      style: 'cancel',
    },
  ]);

export const checkDiscard = (
  onYes: () => void,
  text: string,
  discardText = 'Discard'
) =>
  Alert.alert(
    'Discard changes?',
    'You may have unsaved changes. This will discard those changes.',
    [
      { text, style: 'cancel' },
      {
        text: discardText,
        style: 'destructive',
        onPress: onYes,
      },
    ]
  );

const parseSqlDateString = (dateString: string) =>
  new Date(dateString.replace(' ', 'T') + 'Z');

export const dateToDisplay = (dateString: string) =>
  parseSqlDateString(dateString).toLocaleString(undefined, {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'long',
  });
