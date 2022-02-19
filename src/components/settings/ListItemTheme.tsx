import ListWithOptions from './ListWithOptions';
import { ThemeType } from '../../redux/reducers/settingsReducer';
import { updateSetting } from '../../redux/actions';
import { useAppDispatch } from '../../redux/store';
import { useSetting } from '../../redux/selectors';

const ListItemTheme = () => {
  const dispatch = useAppDispatch();
  const setting = useSetting('theme');
  const options = Object.values(ThemeType);
  const selectedIndex = options.indexOf(setting);

  return (
    <ListWithOptions
      title="Theme"
      optionLabels={options}
      selectedIndex={selectedIndex}
      setSelectedIndex={(newIndex) =>
        dispatch(updateSetting({ theme: options[newIndex] }))
      }
    />
  );
};

export default ListItemTheme;
