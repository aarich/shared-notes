import { Button, Input as UIKInput, Layout, Text } from '@ui-kitten/components';
import React, { useRef } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Input from '../components/shared/Input';
import PotentialAd from '../components/shared/PotentialAd';
import { AdUnit } from '../utils/ads';
import { copyWithConfirm, dateToDisplay } from '../utils/experience';
import QRModal from './QRModal';

type StringSetter = (str: string) => void;

type Props = {
  slug: string;
  setSlug: StringSetter;
  isRefreshing: boolean;
  onRefresh: () => void;
  name: string;
  setName: StringSetter;
  isNew: boolean;
  content: string;
  setContent: StringSetter;
  onSave: () => void;
  isDirty: boolean;
  qrVisible: boolean;
  setQRVisible: (b: boolean) => void;
  lastModified?: string;
};

const EditScreen = ({
  slug,
  setSlug,
  isRefreshing,
  onRefresh,
  name,
  setName,
  isNew,
  content,
  setContent,
  onSave,
  isDirty,
  qrVisible,
  setQRVisible,
  lastModified,
}: Props) => {
  const contentRef = useRef<UIKInput>(null);
  return (
    <Layout style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior="padding"
      >
        <QRModal
          visible={qrVisible}
          onBackdropPress={() => setQRVisible(false)}
          slug={slug}
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
                value={name}
                onChangeText={setName}
                returnKeyType="next"
                onSubmitEditing={contentRef.current?.focus}
                blurOnSubmit={false}
              />
              <Pressable
                onPress={isNew ? undefined : () => copyWithConfirm(slug || '')}
              >
                <Input
                  label="Slug"
                  placeholder="Note Slug"
                  value={slug}
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
                value={content}
                onChangeText={setContent}
                numberOfLines={10}
                textStyle={{ minHeight: 64 }}
                multiline={true}
                size="large"
                ref={contentRef}
              />
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
        <PotentialAd unit={AdUnit.edit} />
      </KeyboardAvoidingView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  margined: { marginHorizontal: '5%', marginVertical: '2%' },
  container: { flex: 1, flexGrow: 1 },
  keyboardAvoidingContainer: { flex: 1 },
  button: { marginVertical: 10 },
});

export default EditScreen;
