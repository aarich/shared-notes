import { StackNavigationProp } from '@react-navigation/stack';
import {
  Divider,
  Icon,
  Layout,
  List,
  Text,
  TopNavigationAction,
} from '@ui-kitten/components';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import DeletableListItem from '../components/shared/DeletableListItem';
import PotentialAd from '../components/shared/PotentialAd';
import { useNotes } from '../redux/selectors';
import { useAppDispatch } from '../redux/store';
import { AdUnit } from '../utils/ads';
import { deleteNoteAlert } from '../utils/experience';
import { Note, NotesParamList } from '../utils/types';

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
          onPress={() => navigation.push('EditScreen', { slug: undefined })}
        />
      ),
    });
  }, [navigation]);

  return (
    <Layout style={styles.container}>
      <List
        style={styles.list}
        ItemSeparatorComponent={Divider}
        data={notes}
        keyExtractor={(item: Note) => item.slug}
        renderItem={({ item }: { item: Note }) => (
          <DeletableListItem
            onDelete={() => deleteNoteAlert(item, dispatch)}
            title={item.name}
            onPress={() => navigation.push('EditScreen', { slug: item.slug })}
            accessoryRight={(props) => (
              <Pressable
                style={styles.row}
                onPress={() => deleteNoteAlert(item, dispatch)}
              >
                <Icon {...props} name="trash-outline" />
                <Icon {...props} name="chevron-right-outline" />
              </Pressable>
            )}
          />
        )}
        contentContainerStyle={
          notes.length === 0 ? styles.emptyContainer : undefined
        }
        ListEmptyComponent={
          <View style={[styles.container, styles.emptyView]}>
            <Text category="h1">Nothing Here</Text>
            <Text category="s1" style={styles.text}>
              Not sure where to start? Tap the + icon at the top right to create
              a note!
            </Text>
          </View>
        }
      />
      <PotentialAd unit={AdUnit.library} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { flex: 1, width: '100%' },
  row: { flexDirection: 'row' },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyView: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  text: { textAlign: 'center', paddingTop: 10 },
});

export default LibraryScreen;
