import { ListItem, Toggle } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { updateSetting } from '../../redux/actions';
import { AdType } from '../../redux/reducers/settingsReducer';
import { useSetting } from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';

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
          style={styles.toggle}
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

const styles = StyleSheet.create({
  toggle: { paddingRight: 10 },
});
