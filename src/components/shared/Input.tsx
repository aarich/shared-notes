import { Icon, Input as UIKInput } from '@ui-kitten/components';
import { StyleProp, TextProps, TextStyle, View } from 'react-native';

import React from 'react';
import { RenderProp } from '@ui-kitten/components/devsupport';
import useColorScheme from '../../hooks/useColorScheme';

type Props = {
  style?: StyleProp<TextStyle>;
  value: string | number;
  label?: RenderProp<TextProps> | React.ReactText;
  placeholder: string;
  onChangeText: (newText: string) => void;
  iconRight?: string;
  numeric?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  size?: string;
  textStyle?: StyleProp<TextStyle>;
};

const Input = ({ value, iconRight, numeric = false, ...otherProps }: Props) => {
  const type = numeric || typeof value === 'number' ? 'numeric' : 'default';
  const scheme = useColorScheme();
  return (
    <View style={{ paddingTop: 5 }}>
      <UIKInput
        {...otherProps}
        value={value + ''}
        accessoryRight={
          iconRight
            ? (props) => <Icon {...props} name={iconRight} />
            : undefined
        }
        keyboardType={type}
        keyboardAppearance={scheme}
      />
    </View>
  );
};

export default Input;
