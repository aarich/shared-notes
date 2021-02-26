import {
  Alert,
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Card,
  Icon,
  Layout,
  Modal,
  Text,
  TopNavigationAction,
} from '@ui-kitten/components';
import { NoteDraft, NotesParamList } from '../utils/types';
import React, { useCallback, useEffect, useState } from 'react';
import {
  checkDiscard,
  copyWithConfirm,
  getShareLink,
  noteSavedMessage,
  sendErrorAlert,
  shareNote,
  showInfoAlert,
} from '../utils/experience';
import { getNote, patchNote, postNote } from '../redux/actions/thunks';

import { AdUnit } from '../utils/ads';
import Input from '../components/shared/Input';
import PotentialAd from '../components/shared/PotentialAd';
import QRCode from 'react-native-qrcode-svg';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { generateSlug } from 'random-word-slugs';
import { massageNewEditorContent } from '../utils/editor';
import { useAppDispatch } from '../redux/store';
import { useNote } from '../redux/selectors';
import { useUpToDateBridgeData } from '../utils/bridge';

const { width } = Dimensions.get('window');

type Props = {
  navigation: StackNavigationProp<NotesParamList, 'EditScreen'>;
  route: RouteProp<NotesParamList, 'EditScreen'>;
};

const EditScreen = ({ navigation, route }: Props) => {
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
    slug: slug || generateSlug(4),
  }));

  const setDraftWrapper = (newDraft: NoteDraft) => {
    setIsDirty(true);
    setDraft(newDraft);
  };

  const [bridgeError, setBridgeError] = useUpToDateBridgeData();
  useEffect(() => {
    if (bridgeError) {
      Alert.alert('Error', bridgeError);
      setBridgeError(undefined);
    }
  }, [bridgeError, setBridgeError]);

  useEffect(() => {
    if (!isNew) {
      slug &&
        dispatch(getNote(slug))
          .then((note) => setDraft({ ...note }))
          .catch(sendErrorAlert)
          .then(() => setIsRefreshing(false));
    }
  }, [dispatch, isNew, slug]);

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
    const headerRight = () => (
      <View style={{ flexDirection: 'row' }}>
        <TopNavigationAction
          icon={(props) => (
            <Icon
              {...props}
              name={isNew ? 'cloud-download-outline' : 'share-outline'}
            />
          )}
          onPress={() => (isNew ? loadNote() : shareNoteAlert())}
        />
        <TopNavigationAction
          icon={(props) => <Icon {...props} name="info-outline" />}
          onPress={() => showInfoAlert(draft.content, isNew)}
        />
      </View>
    );

    navigation.setOptions({
      headerTitle: isNew ? 'Create Note' : 'Edit Note',
      headerRight,
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

  return (
    <Layout style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior="padding"
      >
        <Modal
          visible={qrVisible}
          onBackdropPress={() => setQRVisible(false)}
          backdropStyle={styles.backdrop}
        >
          <Card
            header={(props) => (
              <View {...props}>
                <Text category="s1">Point another iPhone camera at this!</Text>
              </View>
            )}
            footer={(props) => (
              <View {...props}>
                <Text category="s2">Tap outside to dismiss</Text>
              </View>
            )}
          >
            <View style={styles.qrCardBody}>
              <QRCode
                value={getShareLink(draft.slug)}
                size={Math.floor(width * 0.7)}
              />
            </View>
          </Card>
        </Modal>
        <FlatList
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          keyExtractor={(_, i) => '' + i}
          renderItem={() => null}
          data={[]}
          ListHeaderComponent={
            <View style={styles.margined}>
              <Input
                label="Title"
                placeholder="Note Title"
                value={draft.name}
                onChangeText={(name) => setDraftWrapper({ ...draft, name })}
              />
              <Pressable
                onPress={isNew ? undefined : () => copyWithConfirm(slug || '')}
              >
                <Input
                  label="Slug"
                  placeholder="Note Slug"
                  value={draft.slug}
                  onChangeText={(slug) => setDraftWrapper({ ...draft, slug })}
                  disabled={!isNew}
                />
              </Pressable>
              <Input
                label="Content"
                placeholder="Note Content"
                value={draft.content}
                onChangeText={(newContent) =>
                  setDraftWrapper({
                    ...draft,
                    content: massageNewEditorContent(draft.content, newContent),
                  })
                }
                numberOfLines={10}
                textStyle={{ minHeight: 64 }}
                multiline={true}
                size="large"
              />
              <Button
                style={styles.button}
                disabled={!isDirty}
                onPress={() => {
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
                }}
              >
                Save
              </Button>
            </View>
          }
        />
        <PotentialAd unit={AdUnit.edit} />
      </KeyboardAvoidingView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  qrCardBody: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
  margined: { marginHorizontal: '5%', marginVertical: '2%' },
  container: { flex: 1, flexGrow: 1 },
  keyboardAvoidingContainer: { flex: 1 },
  button: { marginTop: 10, marginBottom: 40 },
});

export default EditScreen;
