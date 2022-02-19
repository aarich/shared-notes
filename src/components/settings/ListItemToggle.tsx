import { ListItem, Toggle } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { updateSetting } from '../../redux/actions';
import {
  AnySetting,
  BooleanSettings,
} from '../../redux/reducers/settingsReducer';
import { useSetting } from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';

const labels = {
  showTitle: 'Show Title',
  showLastModified: 'Show Last Modified',
};
const descriptions = {
  showTitle: 'Show the note title',
  showLastModified: 'Includes a timestamp in the widget',
};

const ListItemToggle = ({ setting }: { setting: keyof BooleanSettings }) => {
  const dispatch = useAppDispatch();
  const on = useSetting(setting);

  return (
    <ListItem
      disabled
      title={labels[setting]}
      description={descriptions[setting]}
      accessoryRight={() => (
        <Toggle
          style={styles.toggle}
          checked={on}
          onChange={() =>
            dispatch(updateSetting({ [setting]: !on } as AnySetting))
          }
        />
      )}
    />
  );
};

export default ListItemToggle;

const styles = StyleSheet.create({
  toggle: { paddingRight: 10 },
});
