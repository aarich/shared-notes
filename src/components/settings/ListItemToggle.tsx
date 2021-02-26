import * as React from 'react';

import {
  AnySetting,
  BooleanSettings,
} from '../../redux/reducers/settingsReducer';
import { ListItem, Toggle } from '@ui-kitten/components';

import { updateSetting } from '../../redux/actions';
import { useAppDispatch } from '../../redux/store';
import { useSetting } from '../../redux/selectors';

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
