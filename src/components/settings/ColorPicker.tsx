import { Card, Text, useTheme } from '@ui-kitten/components';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import ColorPalette from 'react-native-color-palette';
import { updateSetting } from '../../redux/actions';
import { useSetting } from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';

const { width } = Dimensions.get('window');
const labels = [
  'Set a color for the widget',
  'Finished? Tap outside the modal',
  'Tap outside the modal when finished',
  "Indecisive? Just choose one, it'll be ok.",
  "Tap outside when you're finished.",
];

const ColorPicker = () => {
  const dispatch = useAppDispatch();
  const [label, setLabel] = useState(0);
  const color = useSetting('widgetColor');
  const theme = useTheme();
  const types = [
    'color-primary',
    'color-success',
    'color-warning',
    'color-danger',
  ];
  const colors = [
    '#FFFFFF',
    '#D3D3D3',
    '#A9A9A9',
    '#808080',
    '#404040',
    '#000000',
  ];
  types.forEach((type) =>
    [1, 3, 4, 5, 7, 9].forEach((i) => colors.push(theme[type + '-' + i * 100]))
  );

  return (
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
          colors={colors} //['#C0392B', '#E74C3C', '#9B59B6', '#8E44AD', '#2980B9']}
          title={''}
          icon={<Text>{'✔'}</Text>}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  body: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
});

export default ColorPicker;
