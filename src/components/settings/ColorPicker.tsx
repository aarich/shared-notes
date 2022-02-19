import { Card, Icon, Modal, Text, useTheme } from '@ui-kitten/components';
import { useMemo, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import ColorPalette from 'react-native-color-palette';
import { updateSetting } from '../../redux/actions';
import { useSetting } from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';

const { width } = Dimensions.get('window');

const labels = [
  'Select a color for the widget',
  'Finished? Tap outside',
  'Tap outside when finished',
  "Indecisive? Just choose one, it'll be ok.",
  "Tap outside when you're finished.",
];

const getTextColorForBackground = (color: string, colors: string[]) => {
  return colors.indexOf(color) % 6 > 3 ? '#FFF' : '#000';
};

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

const ColorPicker = ({ visible, onDismiss }: Props) => {
  const dispatch = useAppDispatch();
  const [label, setLabel] = useState(0);
  const color = useSetting('widgetColor');
  const theme = useTheme();

  const colors = useMemo(() => {
    const types = [
      'color-danger',
      'color-warning',
      'color-success',
      'color-primary',
    ];
    const ret: string[] = [];
    types.forEach((type) =>
      [1, 3, 4, 5, 7, 9].forEach((i) => ret.push(theme[type + '-' + i * 100]))
    );
    ret.push('#FFFFFF', '#D3D3D3', '#A9A9A9', '#808080', '#404040', '#000000');

    return ret;
  }, [theme]);

  return (
    <Modal
      visible={visible}
      onBackdropPress={onDismiss}
      backdropStyle={styles.backdrop}
    >
      <Card
        style={{ maxWidth: Math.floor(width * 0.9) }}
        header={(props) => (
          <View {...props}>
            <Text category="s1">{labels[label]}</Text>
          </View>
        )}
      >
        <View style={styles.body}>
          <ColorPalette
            onChange={(widgetColor: string) => {
              setLabel((l) => (l + 1) % labels.length);
              dispatch(updateSetting({ widgetColor }));
            }}
            value={color}
            colors={colors}
            title=""
            icon={
              <Icon
                name="checkmark-circle-2-outline"
                fill={getTextColorForBackground(color, colors)}
                style={styles.icon}
              />
            }
          />
        </View>
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  body: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
  icon: { width: 25, height: 25 },
});

export default ColorPicker;
