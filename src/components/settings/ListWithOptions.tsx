import { Button, ListItem } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import ButtonPicker from '../shared/ButtonPicker';

type Props = {
  selectedIndex: number;
  setSelectedIndex: (newindex: number) => void;
  optionLabels: string[];
  title: string;
};

const ListWithOptions = ({
  selectedIndex,
  setSelectedIndex,
  optionLabels,
  title,
}: Props) => {
  return (
    <ListItem
      disabled
      title={title}
      accessoryRight={() => (
        <ButtonPicker
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          style={styles.button}
        >
          {optionLabels.map((label, i) => (
            <Button key={i}>{label}</Button>
          ))}
        </ButtonPicker>
      )}
    />
  );
};

export default ListWithOptions;

const styles = StyleSheet.create({
  button: { paddingRight: 10 },
});
