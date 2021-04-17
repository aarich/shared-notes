import { Icon, Input as UIKInput, InputProps } from '@ui-kitten/components';
import React, { forwardRef } from 'react';
import { Dimensions, View } from 'react-native';
import useColorScheme from '../../hooks/useColorScheme';

type Props = {
  iconRight?: string;
  numeric?: boolean;
} & InputProps;

const Input = forwardRef<UIKInput, Props>(
  ({ value, iconRight, numeric = false, ...otherProps }: Props, ref) => {
    const type = numeric || typeof value === 'number' ? 'numeric' : 'default';
    const scheme = useColorScheme();
    return (
      <View style={{ paddingTop: 5 }}>
        <UIKInput
          {...otherProps}
          ref={ref}
          value={value + ''}
          accessoryRight={
            iconRight
              ? (props) => <Icon {...props} name={iconRight} />
              : undefined
          }
          keyboardType={type}
          keyboardAppearance={scheme}
          style={{
            maxHeight: Math.floor(Dimensions.get('screen').height * 0.4),
          }}
        />
      </View>
    );
  }
);

export default Input;
