import { generateSlug } from 'random-word-slugs';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { Alert, Keyboard } from 'react-native';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import EditHeaderActions from '../components/EditHeaderActions';
import EditScreen from '../components/EditScreen';
import EditScreenCheckboxMode from '../components/EditScreenCheckboxMode';
import { getNote, patchNote, postNote } from '../redux/actions/thunks';
import { useNote } from '../redux/selectors';
import { useAppDispatch } from '../redux/store';
import { useUpToDateBridgeData } from '../utils/bridge';
import { massageNewEditorContent } from '../utils/editor';
import {
    checkDiscard, noteSavedMessage, openCheckboxEditModeMessage, sendErrorAlert, shareNote
} from '../utils/experience';
import { NoteDraft, NotesParamList } from '../utils/types';

type Props = {
  navigation: StackNavigationProp<NotesParamList, 'EditScreen'>;
  route: RouteProp<NotesParamList, 'EditScreen'>;
};

const EditScreenContainer = ({ navigation, route }: Props) => {
  const dispatch = useAppDispatch();
  const { slug: routeSlug } = route.params;
  const [isNew, setIsNew] = useState(!routeSlug);
  const [qrVisible, setQRVisible] = useState(false);
  const note = useNote(routeSlug);
  const [isDirty, setIsDirty] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [useCheckboxMode, toggleCheckboxMode] = useReducer((b) => !b, false);
  const [draft, setDraft] = useState<NoteDraft>(() => ({
    name: note?.name || '',
    content: note?.content || '',
    slug: routeSlug || generateSlug(),
    columns: note?.columns || 1,
  }));

  const setDraftWrapper = useCallback(
    (updates: Partial<NoteDraft>) => {
      setIsDirty(true);
      setDraft({ ...draft, ...updates });
    },
    [draft]
  );

  const [bridgeError, setBridgeError] = useUpToDateBridgeData();
  useEffect(() => {
    if (bridgeError) {
      Alert.alert('Error', bridgeError);
      setBridgeError(undefined);
    }
  }, [bridgeError, setBridgeError]);

  // Refresh note
  useEffect(() => {
    if (!isNew && routeSlug && note) {
      setIsRefreshing(true);
      dispatch(getNote(routeSlug))
        .then((updatedNote) => {
          if (updatedNote.modified !== note.modified) {
            Alert.alert(
              'Note was Updated',
              'This note has been updated since the last time you viewed it in the app. Would you like to update to the latest?',
              [
                {
                  text: 'Update',
                  onPress: () => setDraft({ ...updatedNote }),
                },
                {
                  text: 'Ignore',
                  onPress: () => {
                    Alert.alert(
                      'FYI',
                      'If you want to update to the latest, just pull down to refresh.'
                    );
                    setIsDirty(true);
                  },
                },
              ]
            );
          }
        })
        .catch(sendErrorAlert)
        .then(() => setIsRefreshing(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isNew]);

  const loadNote = useCallback(() => {
    Keyboard.dismiss();
    Alert.prompt(
      'Load',
      "Enter the slug/identifier of a note you'd like to load",
      [
        {
          text: 'Load',
          onPress: (slug) =>
            slug
              ? dispatch(getNote(slug))
                  .then((updatedNote) => {
                    setIsNew(false);
                    setDraft({ ...updatedNote });
                    setIsDirty(false);
                  })
                  .catch(sendErrorAlert)
              : Alert.alert('Enter a slug'),
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      'plain-text'
    );
  }, [dispatch]);

  const shareNoteAlert = useCallback(() => {
    Keyboard.dismiss();
    Alert.alert('Share', 'How would you like to share this note?', [
      { text: 'View QR Code', onPress: () => setQRVisible(true) },
      { text: 'Share Link', onPress: () => shareNote(draft.slug) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [draft.slug]);

  useEffect(() => {
    if (!isNew && useCheckboxMode) {
      openCheckboxEditModeMessage();
    }
  }, [isNew, useCheckboxMode]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: isNew ? 'Create Note' : 'Edit Note',
      headerRight: () => (
        <EditHeaderActions
          content={draft.content}
          isNew={isNew}
          isCheckboxMode={useCheckboxMode}
          isDirty={isDirty}
          loadNote={loadNote}
          shareNote={shareNoteAlert}
          toggleCheckbox={!isNew ? toggleCheckboxMode : undefined}
        />
      ),
    });
  }, [
    draft.content,
    isNew,
    loadNote,
    navigation,
    shareNoteAlert,
    useCheckboxMode,
    isDirty,
  ]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (!isDirty) {
          return;
        }
        e.preventDefault();
        checkDiscard(() => navigation.dispatch(e.data.action), 'Stay Here');
      }),
    [navigation, isDirty]
  );

  const onRefresh = useCallback(() => {
    const inner = () => {
      setIsRefreshing(true);
      routeSlug &&
        dispatch(getNote(routeSlug))
          .then((note) => setDraft({ ...note }))
          .then(() => setIsDirty(false))
          .catch(sendErrorAlert)
          .then(() => setIsRefreshing(false));
    };
    if (isDirty) {
      Promise.resolve()
        .then(() => setIsRefreshing(true))
        .then(() => setIsRefreshing(false))
        .then(() => checkDiscard(inner, 'Cancel', 'Refresh and Lose Changes'));
    } else {
      inner();
    }
  }, [dispatch, isDirty, routeSlug]);

  const onSave = useCallback(
    (content?: string) => {
      setIsDirty(false);
      setIsRefreshing(true);
      const draftToSave =
        typeof content === 'undefined' ? draft : { ...draft, content };

      (isNew
        ? dispatch(postNote(draftToSave)).then(() => undefined)
        : dispatch(patchNote(draftToSave)).then(() => undefined)
      )
        .then(() => !useCheckboxMode && noteSavedMessage(isNew))
        .then(() => setIsNew(false))
        .catch(sendErrorAlert)
        .then(() => setIsRefreshing(false));
    },
    [dispatch, draft, isNew, useCheckboxMode]
  );

  const setContent = (newContent: string) =>
    setDraftWrapper({
      content: massageNewEditorContent(draft.content, newContent),
    });

  return useCheckboxMode ? (
    <EditScreenCheckboxMode
      draft={draft}
      isRefreshing={isRefreshing}
      onSave={onSave}
      setContent={setContent}
      setIsDirty={setIsDirty}
    />
  ) : (
    <EditScreen
      setName={(name) => setDraftWrapper({ name })}
      setContent={setContent}
      set2Cols={(is2Cols) => setDraftWrapper({ columns: is2Cols ? 2 : 1 })}
      draft={draft}
      isDirty={isDirty}
      isRefreshing={isRefreshing}
      onRefresh={onRefresh}
      onSave={() => onSave()}
      qrVisible={qrVisible}
      setQRVisible={setQRVisible}
      lastModified={note?.modified}
    />
  );
};

export default EditScreenContainer;
