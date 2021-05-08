import { Alert, Keyboard } from 'react-native';
import { NoteDraft, NotesParamList } from '../utils/types';
import React, { useCallback, useEffect, useState } from 'react';
import {
  checkDiscard,
  noteSavedMessage,
  sendErrorAlert,
  shareNote,
} from '../utils/experience';
import { getNote, patchNote, postNote } from '../redux/actions/thunks';

import EditHeaderActions from '../components/EditHeaderActions';
import EditScreen from '../components/EditScreen';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { generateSlug } from 'random-word-slugs';
import { massageNewEditorContent } from '../utils/editor';
import { useAppDispatch } from '../redux/store';
import { useNote } from '../redux/selectors';
import { useUpToDateBridgeData } from '../utils/bridge';

type Props = {
  navigation: StackNavigationProp<NotesParamList, 'EditScreen'>;
  route: RouteProp<NotesParamList, 'EditScreen'>;
};

const EditScreenContainer = ({ navigation, route }: Props) => {
  const dispatch = useAppDispatch();
  const { slug } = route.params;
  const [isNew, setIsNew] = useState(!slug);
  const [qrVisible, setQRVisible] = useState(false);
  const note = useNote(slug);
  const [isDirty, setIsDirty] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [draft, setDraft] = useState<NoteDraft>(() => ({
    name: note?.name || '',
    content: note?.content || '',
    slug: slug || generateSlug(),
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
    if (!isNew && slug && note) {
      setIsRefreshing(true);
      dispatch(getNote(slug))
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
                  .then((note) => {
                    setIsNew(false);
                    setDraft({ ...note });
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
    navigation.setOptions({
      headerTitle: isNew ? 'Create Note' : 'Edit Note',
      headerRight: () => (
        <EditHeaderActions
          content={draft.content}
          isNew={isNew}
          loadNote={loadNote}
          shareNote={shareNoteAlert}
        />
      ),
    });
  }, [draft.content, isNew, loadNote, navigation, shareNoteAlert]);

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
      slug &&
        dispatch(getNote(slug))
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
  }, [dispatch, isDirty, slug]);

  const onSave = useCallback(() => {
    setIsDirty(false);
    setIsRefreshing(true);
    (isNew
      ? dispatch(postNote(draft)).then(() => undefined)
      : dispatch(patchNote(draft)).then(() => undefined)
    )
      .then(() => noteSavedMessage(isNew))
      .then(() => setIsNew(false))
      .catch(sendErrorAlert)
      .then(() => setIsRefreshing(false));
  }, [dispatch, draft, isNew]);

  return (
    <EditScreen
      setSlug={(slug) => setDraftWrapper({ slug })}
      setName={(name) => setDraftWrapper({ name })}
      setContent={(newContent) =>
        setDraftWrapper({
          content: massageNewEditorContent(draft.content, newContent),
        })
      }
      set2Cols={(is2Cols) => setDraftWrapper({ columns: is2Cols ? 2 : 1 })}
      {...{
        draft,
        isDirty,
        isNew,
        isRefreshing,
        onRefresh,
        onSave,
        qrVisible,
        setQRVisible,
      }}
      lastModified={note?.modified}
    />
  );
};

export default EditScreenContainer;
