import * as React from 'react';
import { updateSetting } from '../../redux/actions';
import { AdType } from '../../redux/reducers/settingsReducer';
import { useSetting } from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';
import ListWithOptions from './ListWithOptions';

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
