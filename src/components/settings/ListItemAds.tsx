import * as React from 'react';

import { ListItem, Toggle } from '@ui-kitten/components';

import { AdType } from '../../redux/reducers/settingsReducer';
import { updateSetting } from '../../redux/actions';
import { useAppDispatch } from '../../redux/store';
import { useSetting } from '../../redux/selectors';

const ListItemAds = () => {
  const dispatch = useAppDispatch();
  const setting = useSetting('ads');

  return (
    <ListItem
      disabled
      title="Show Ads"
      description="Support the developer!"
      accessoryRight={() => (
        <Toggle
          style={{ paddingRight: 10 }}
          checked={setting !== AdType.Off}
          onChange={() =>
            dispatch(
              updateSetting({
                ads: setting === AdType.Off ? AdType.On : AdType.Off,
              })
            )
          }
        />
      )}
    />
  );
};

export default ListItemAds;
