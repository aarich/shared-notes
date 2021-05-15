import {
  Button,
  Layout,
  Text,
  TextProps,
  Toggle,
  Input as UIKInput,
} from '@ui-kitten/components';
import {
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { copyWithConfirm, dateToDisplay } from '../utils/experience';

import { AdUnit } from '../utils/ads';
import Input from '../components/shared/Input';
import InputNavAccessory from './shared/InputNavAccessory';
import { NoteDraft } from '../utils/types';
import PotentialAd from '../components/shared/PotentialAd';
import QRModal from './QRModal';

type StringSetter = (str: string) => void;

type Props = {
  draft: NoteDraft;
  setSlug: StringSetter;
  isRefreshing: boolean;
  onRefresh: () => void;
  setName: StringSetter;
  isNew: boolean;
  setContent: StringSetter;
  onSave: () => void;
  isDirty: boolean;
  qrVisible: boolean;
  setQRVisible: (b: boolean) => void;
  lastModified?: string;
  set2Cols: (is2Col: boolean) => void;
};

const EditScreen = ({
  draft,
  setSlug,
  isRefreshing,
  onRefresh,
  setName,
  isNew,
  setContent,
  onSave,
  isDirty,
  qrVisible,
  setQRVisible,
  lastModified,
  set2Cols,
}: Props) => {
  const titleRef = useRef<UIKInput>(null);
  const contentRef = useRef<UIKInput>(null);
  const inputAccessoryViewID = 'uniqueID';

  const [titleFocused, setTitleFocused] = useState(false);
  return (
    <Layout style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior="padding"
      >
        <QRModal
          visible={qrVisible}
          onBackdropPress={() => setQRVisible(false)}
          slug={draft.slug}
        />
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
                onChangeText={setName}
                returnKeyType="next"
                onSubmitEditing={contentRef.current?.focus}
                blurOnSubmit={false}
                ref={titleRef}
                inputAccessoryViewID={inputAccessoryViewID}
                onFocus={() => setTitleFocused(true)}
                onBlur={() => setTitleFocused(false)}
              />
              <Pressable
                onPress={
                  isNew ? undefined : () => copyWithConfirm(draft.slug || '')
                }
              >
                <Input
                  label="Slug"
                  placeholder="Note Slug"
                  value={draft.slug}
                  onChangeText={setSlug}
                  disabled={!isNew}
                  returnKeyType="next"
                  onSubmitEditing={contentRef.current?.focus}
                  blurOnSubmit={false}
                />
              </Pressable>
              <Input
                label="Note"
                placeholder="Note Content"
                value={draft.content}
                onChangeText={setContent}
                numberOfLines={10}
                textStyle={{ minHeight: 64 }}
                multiline={true}
                size="large"
                ref={contentRef}
                inputAccessoryViewID={inputAccessoryViewID}
              />
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Toggle checked={draft.columns === 2} onChange={set2Cols}>
                  {(props?: TextProps) => (
                    <View>
                      <Text {...props}>Use two columns</Text>
                      <Text
                        style={{
                          // @ts-ignore
                          marginHorizontal: props?.style?.marginHorizontal,
                        }}
                        category="c2"
                        appearance="hint"
                      >
                        Useful for displaying lists
                      </Text>
                    </View>
                  )}
                </Toggle>
              </View>
              <Button
                style={styles.button}
                disabled={!isDirty}
                onPress={onSave}
              >
                Save
              </Button>
              {lastModified ? (
                <View
                  style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
                >
                  <Text appearance="hint" style={{ fontStyle: 'italic' }}>
                    Last modified {dateToDisplay(lastModified)}
                  </Text>
                </View>
              ) : (
                <></>
              )}
            </View>
          }
        />
        <InputNavAccessory
          nativeID={inputAccessoryViewID}
          canGoUp={!titleFocused}
          canGoDown={titleFocused}
          onPress={(up) =>
            up ? titleRef.current?.focus() : contentRef.current?.focus()
          }
        />
      </KeyboardAvoidingView>
      <PotentialAd unit={AdUnit.edit} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  margined: { marginHorizontal: '5%', marginVertical: '2%' },
  container: { flex: 1 },
  keyboardAvoidingContainer: { flex: 1 },
  button: { marginVertical: 10 },
});

export default EditScreen;
