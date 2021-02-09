import * as React from 'react';

import { Card, Text, useTheme } from '@ui-kitten/components';
import { Dimensions, StyleSheet, View } from 'react-native';

import ColorPalette from 'react-native-color-palette';
import { updateSetting } from '../../redux/actions';
import { useAppDispatch } from '../../redux/store';
import { useSetting } from '../../redux/selectors';

const { width } = Dimensions.get('window');

const ColorPicker = () => {
  const dispatch = useAppDispatch();
  const color = useSetting('widgetColor');
  const theme = useTheme();
  const types = [
    'color-primary',
    'color-success',
    'color-warning',
    'color-danger',
  ];
  const colors: string[] = [];
  types.forEach((type) =>
    [1, 3, 4, 5, 7, 9].forEach((i) => colors.push(theme[type + '-' + i * 100]))
  );

  return (
    <Card
      style={{ maxWidth: Math.floor(width * 0.9) }}
      header={(props) => (
        <View {...props}>
          <Text category="s1">Set a color for the widget</Text>
        </View>
      )}
    >
      <View style={styles.body}>
        <ColorPalette
          onChange={(widgetColor: string) =>
            dispatch(updateSetting({ widgetColor }))
          }
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
