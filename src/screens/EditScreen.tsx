import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Button,
  Card,
  Icon,
  Layout,
  Modal,
  Text,
  TopNavigationAction,
} from '@ui-kitten/components';
import Clipboard from 'expo-clipboard';
import { generateSlug } from 'random-word-slugs';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Input from '../components/shared/Input';
import PotentialAd from '../components/shared/PotentialAd';
import { getNote, patchNote, postNote } from '../redux/actions/thunks';
import { useNote } from '../redux/selectors';
import { useAppDispatch } from '../redux/store';
import { AdUnit } from '../utils/ads';
import { useUpToDateBridgeData } from '../utils/bridge';
import { getShareLink, sendErrorAlert, shareNote } from '../utils/experience';
import { NoteDraft, NotesParamList } from '../utils/types';

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
          .catch(sendErrorAlert)
          .then(() => setIsRefreshing(false));
    }
  }, [dispatch, isNew, slug]);

  useEffect(() => {
    const headerTitle = isNew ? 'Create Note' : 'Edit Note';
    const secureMsg =
      'Anyone who can guess the slug is able to view, edit, or delete this note, so do not enter any private or secure information.';
    const message = isNew
      ? 'Choose a name, slug, and enter content for the note. '
      : 'You can edit the name or content of this note!';
    const headerRight = () => (
      <View style={{ flexDirection: 'row' }}>
        <TopNavigationAction
          icon={(props) => (
            <Icon
              {...props}
              name={isNew ? 'download-outline' : 'share-outline'}
            />
          )}
          onPress={() =>
            isNew
              ? Alert.prompt(
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
                              })
                              .catch(sendErrorAlert)
                          : Alert.alert('Enter a slug'),
                    },
                    { text: 'Cancel', style: 'cancel' },
                  ],
                  'plain-text'
                )
              : Alert.alert('Share', 'How would you like to share this note?', [
                  { text: 'View QR Code', onPress: () => setQRVisible(true) },
                  { text: 'Share Link', onPress: () => shareNote(draft.slug) },
                  { text: 'Cancel', style: 'cancel' },
                ])
          }
        />
        <TopNavigationAction
          icon={(props) => <Icon {...props} name="info-outline" />}
          onPress={() => Alert.alert(headerTitle, message + '\n\n' + secureMsg)}
        />
      </View>
    );

    navigation.setOptions({
      headerTitle,
      headerRight,
    });
  }, [dispatch, draft.slug, isNew, navigation]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (!isDirty) {
          return;
        }
        e.preventDefault();

        Alert.alert(
          'Discard changes?',
          'You may have unsaved changes. This will discard those changes.',
          [
            { text: 'Stay Here', style: 'cancel' },
            {
              text: 'Discard',
              style: 'destructive',
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      }),
    [navigation, isDirty]
  );

  return (
    <Layout style={styles.container}>
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
        onRefresh={() => {
          setIsRefreshing(true);
          slug &&
            dispatch(getNote(slug))
              .catch(sendErrorAlert)
              .then(() => setIsRefreshing(false));
        }}
        keyExtractor={(_, i) => '' + i}
        renderItem={() => <></>}
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
              onPress={
                isNew
                  ? undefined
                  : () =>
                      Alert.alert('Copy to Clipboard?', slug, [
                        {
                          text: 'Copy',
                          onPress: () => Clipboard.setString(slug || ''),
                        },
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                      ])
              }
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
              onChangeText={(content) => setDraftWrapper({ ...draft, content })}
              numberOfLines={10}
              textStyle={{ minHeight: 64 }}
              multiline={true}
              size="large"
            />
            <Button
              style={{ marginTop: 10 }}
              disabled={!isDirty}
              onPress={() =>
                dispatch(isNew ? postNote(draft) : patchNote(draft))
                  .then(() =>
                    Alert.alert(
                      'Note Saved',
                      'To add it to a your home screen, press and hold the widget, then tap "Edit Widget" to choose a note.' +
                        (isNew
                          ? ''
                          : '\n\nOther devices displaying this note will be updated soon!')
                    )
                  )
                  .then(() => setIsNew(false))
                  .catch(sendErrorAlert)
                  .then(() => setIsDirty(false))
              }
            >
              Save
            </Button>
          </View>
        }
      />
      <PotentialAd unit={AdUnit.edit} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  qrCardBody: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
  margined: { marginHorizontal: '5%', marginVertical: '2%' },
  container: { flex: 1, flexGrow: 1 },
});

export default EditScreen;
