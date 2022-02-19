import { CheckBox } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
type Props = {
  label: string;
  isChecked: boolean;
  onToggle: VoidFunction;
};

const RowCheckboxItem = ({ label, isChecked, onToggle }: Props) => {
  return (
    <CheckBox checked={isChecked} onChange={onToggle} style={styles.checkbox}>
      {label}
    </CheckBox>
  );
};

export default RowCheckboxItem;

const styles = StyleSheet.create({ checkbox: { marginVertical: 4 } });
