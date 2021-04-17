import { Icon, TopNavigationAction } from '@ui-kitten/components';
import React from 'react';
import { View } from 'react-native';
import { showInfoAlert } from '../utils/experience';

type Props = {
  content: string;
  isNew: boolean;
  loadNote: () => void;
  shareNote: () => void;
};

const EditHeaderActions = ({ content, isNew, loadNote, shareNote }: Props) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <TopNavigationAction
        icon={(props) => (
          <Icon
            {...props}
            name={isNew ? 'cloud-download-outline' : 'share-outline'}
          />
        )}
        onPress={() => (isNew ? loadNote() : shareNote())}
      />
      <TopNavigationAction
        icon={(props) => <Icon {...props} name="info-outline" />}
        onPress={() => showInfoAlert(content, isNew)}
      />
    </View>
  );
};

export default EditHeaderActions;
