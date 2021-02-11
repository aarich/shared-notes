import * as React from 'react';
import { updateSetting } from '../../redux/actions';
import { ThemeType } from '../../redux/reducers/settingsReducer';
import { useSetting } from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';
import ListWithOptions from './ListWithOptions';

const ListItemTheme = () => {
  const dispatch = useAppDispatch();
  const setting = useSetting('theme');
  const options = Object.values(ThemeType);
  const selectedIndex = options.indexOf(setting);

  return (
    <ListWithOptions
      title="App Theme"
      optionLabels={options}
      selectedIndex={selectedIndex}
      setSelectedIndex={(newIndex) =>
        dispatch(updateSetting({ theme: options[newIndex] }))
      }
    />
  );
};

export default ListItemTheme;
