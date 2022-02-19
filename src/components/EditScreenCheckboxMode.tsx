import {
  Button,
  Icon,
  Layout,
  Spinner,
  Text,
  useTheme,
} from '@ui-kitten/components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { AdUnit } from '../utils/ads';
import { NoteDraft } from '../utils/types';
import RowCheckboxItem from './notes/RowCheckboxItem';
import PotentialAd from './shared/PotentialAd';

type Props = {
  draft: NoteDraft;
  isRefreshing: boolean;
  setContent: (str: string) => void;
  setIsDirty: (isDirty: boolean) => void;
  onSave: (content?: string) => void;
};

const generateItems = (content: string): [string[], boolean] => {
  const trimmed = content.trim();
  if (!trimmed) {
    return [[], false];
  }

  const items = trimmed.split(/\r?\n/);
  const allStartWithDash = items.every((item) => item.startsWith('-'));
  return [items, allStartWithDash];
};

const EditScreenCheckboxMode = ({
  draft,
  isRefreshing,
  setContent,
  setIsDirty,
  onSave,
}: Props) => {
  const [items, removeDash] = useMemo(
    () => generateItems(draft.content),
    [draft.content]
  );
  const [rowsToRemove, setRowsToRemove] = useState<number[]>([]);

  const toggleRow = useCallback((index: number) => {
    setRowsToRemove((oldRows) => {
      if (oldRows.includes(index)) {
        return oldRows.filter((i) => i !== index);
      } else {
        return [...oldRows, index];
      }
    });
  }, []);

  const onPressUpdate = useCallback(() => {
    const rowsToKeep = items.filter((_, i) => !rowsToRemove.includes(i));
    const newContent = rowsToKeep.join('\n') || '';
    setContent(newContent);
    onSave(newContent);
    setRowsToRemove([]);
  }, [items, onSave, rowsToRemove, setContent]);

  useEffect(() => {
    setIsDirty(rowsToRemove.length > 0);
  }, [rowsToRemove, setIsDirty]);

  const textColor = useTheme()[`text-basic-color`];

  return (
    <Layout style={styles.container}>
      <View style={[styles.margined, styles.container]}>
        <Text category="h6" style={styles.title} numberOfLines={10}>
          {draft.name}
        </Text>
        <FlatList
          style={styles.container}
          data={items}
          keyExtractor={(_, index) => `${index}`}
          renderItem={({ item, index }) => (
            <RowCheckboxItem
              label={item.substring(removeDash ? 1 : 0).trim()}
              isChecked={rowsToRemove.includes(index)}
              onToggle={() => toggleRow(index)}
            />
          )}
          extraData={rowsToRemove}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Your note is empty. Tap the{' '}
              <Icon
                name="checkmark-square-2-outline"
                width={14}
                height={14}
                fill={textColor}
              />{' '}
              above to return to the editor.
            </Text>
          }
        />
        <Button
          style={styles.button}
          disabled={rowsToRemove.length === 0 || isRefreshing}
          onPress={onPressUpdate}
          accessoryRight={isRefreshing ? <Spinner /> : undefined}
        >
          Remove Checked Items
        </Button>
      </View>
      <PotentialAd unit={AdUnit.edit} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  margined: { marginHorizontal: '5%', marginVertical: '2%' },
  container: { flex: 1 },
  empty: {
    fontStyle: 'italic',
    textAlign: 'center',
  },
  title: { marginBottom: 10 },
  button: { marginVertical: 10 },
});

export default EditScreenCheckboxMode;
