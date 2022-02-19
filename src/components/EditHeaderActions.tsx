import { Icon, TopNavigationAction } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import {
  checkDiscard,
  showCheckboxInfoAlert,
  showInfoAlert,
} from '../utils/experience';

type Props = {
  content: string;
  isNew: boolean;
  isCheckboxMode: boolean;
  isDirty: boolean;
  loadNote: () => void;
  shareNote: () => void;
  toggleCheckbox?: () => void;
};

const EditHeaderActions = ({
  content,
  isNew,
  isCheckboxMode,
  isDirty,
  loadNote,
  shareNote,
  toggleCheckbox,
}: Props) => {
  const onPressToggleCheckbox = () => {
    if (isDirty && toggleCheckbox) {
      checkDiscard(toggleCheckbox, 'Stay here');
    } else {
      toggleCheckbox ? toggleCheckbox() : showCheckboxInfoAlert(true);
    }
  };

  const cbIcon = `${isCheckboxMode ? 'checkmark-square-2' : 'square'}-outline`;
  const loadShareIcon = `${isNew ? 'cloud-download' : 'share'}-outline`;

  return (
    <View style={styles.row}>
      {isCheckboxMode ? undefined : (
        <TopNavigationAction
          icon={(props) => <Icon {...props} name={loadShareIcon} />}
          onPress={() => (isNew ? loadNote() : shareNote())}
        />
      )}
      <TopNavigationAction
        icon={(props) => <Icon {...props} name={cbIcon} />}
        onLongPress={() => showCheckboxInfoAlert(false)}
        onPress={onPressToggleCheckbox}
      />
      <TopNavigationAction
        icon={(props) => <Icon {...props} name="info-outline" />}
        onPress={() => showInfoAlert(content, isNew)}
      />
    </View>
  );
};

export default EditHeaderActions;

const styles = StyleSheet.create({ row: { flexDirection: 'row' } });
