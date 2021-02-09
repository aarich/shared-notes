import {
  Divider,
  Icon,
  Layout,
  List,
  ListItem,
  Text,
  TopNavigationAction,
} from '@ui-kitten/components';
import { Note, NotesParamList } from '../utils/types';
import { Pressable, StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';

import { AdUnit } from '../utils/ads';
import PotentialAd from '../components/shared/PotentialAd';
import { StackNavigationProp } from '@react-navigation/stack';
import { deleteNoteAlert } from '../utils/experience';
import { useAppDispatch } from '../redux/store';
import { useNotes } from '../redux/selectors';

type Props = {
  navigation: StackNavigationProp<NotesParamList, 'Library'>;
};

const LibraryScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const notes = useNotes();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TopNavigationAction
          icon={(props) => <Icon {...props} name="plus" />}
          onPress={() => navigation.push('EditScreen', {})}
        />
      ),
    });
  }, [navigation]);

  return (
    <Layout style={styles.container}>
      <List
        style={{ flex: 1, width: '100%' }}
        ItemSeparatorComponent={Divider}
        data={notes}
        keyExtractor={(item: Note) => item.slug}
        renderItem={({ item }: { item: Note }) => (
          <ListItem
            title={item.name}
            onPress={() => navigation.push('EditScreen', { slug: item.slug })}
            accessoryRight={(props) => (
              <Pressable
                style={{ flexDirection: 'row' }}
                onPress={() => deleteNoteAlert(item, dispatch)}
              >
                <Icon {...props} name="trash-outline" />
                <Icon {...props} name="chevron-right-outline" />
              </Pressable>
            )}
          />
        )}
        contentContainerStyle={
          notes.length === 0
            ? {
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }
            : undefined
        }
        ListEmptyComponent={
          <View
            style={[
              styles.container,
              {
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                width: '80%',
              },
            ]}
          >
            <Text category="h1">Nothing Here</Text>
            <Text category="s1" style={{ textAlign: 'center', paddingTop: 10 }}>
              {
                'Not sure where to start? Tap the + icon at the top right to create a note!'
              }
            </Text>
          </View>
        }
      />
      <PotentialAd unit={AdUnit.library} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LibraryScreen;
