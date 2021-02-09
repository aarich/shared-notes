import * as React from 'react';

import { AdType } from '../../redux/reducers/settingsReducer';
import ListWithOptions from './ListWithOptions';
import { updateSetting } from '../../redux/actions';
import { useAppDispatch } from '../../redux/store';
import { useSetting } from '../../redux/selectors';

const ListItemAds = () => {
  const dispatch = useAppDispatch();
  const setting = useSetting('ads');
  const options = Object.values(AdType);
  const selectedIndex = options.indexOf(setting);

  return (
    <ListWithOptions
      title="Ad Choices"
      optionLabels={options}
      selectedIndex={selectedIndex}
      setSelectedIndex={(newIndex) =>
        dispatch(updateSetting({ ads: options[newIndex] }))
      }
    />
  );
};

export default ListItemAds;
