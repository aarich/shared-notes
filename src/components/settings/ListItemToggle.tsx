import { ListItem, Toggle } from '@ui-kitten/components';
import * as React from 'react';
import { updateSetting } from '../../redux/actions';
import {
  AnySetting,
  BooleanSettings,
} from '../../redux/reducers/settingsReducer';
import { useSetting } from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';

const labels = {
  showTitle: 'Show Note Title',
  showLastModified: 'Show Last Modified',
};

const ListItemToggle = ({ setting }: { setting: keyof BooleanSettings }) => {
  const dispatch = useAppDispatch();
  const on = useSetting(setting);

  return (
    <ListItem
      disabled
      title={labels[setting]}
      accessoryRight={() => (
        <Toggle
          style={{ paddingRight: 10 }}
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
