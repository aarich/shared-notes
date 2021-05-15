import { Button, Icon } from '@ui-kitten/components';
import { InputAccessoryView, Keyboard, StyleSheet, View } from 'react-native';
import React, { useCallback, useMemo } from 'react';

type Props = {
  nativeID: string;
  canGoUp: boolean;
  canGoDown: boolean;
  onPress: (up: boolean) => void;
};

const InputNavAccessory = ({
  nativeID,
  onPress,
  canGoDown,
  canGoUp,
}: Props) => {
  const btnProps = useMemo(
    () => ({ status: 'basic', size: 'small', style: styles.button }),
    []
  );

  const renderNav = useCallback(
    (up: boolean) => (
      <Button
        {...btnProps}
        onPress={() => onPress(up)}
        accessoryLeft={(props) => (
          <Icon
            {...props}
            name={`arrow-ios-${up ? 'upward' : 'downward'}-outline`}
          />
        )}
      />
    ),
    [btnProps, onPress]
  );
  return (
    <InputAccessoryView nativeID={nativeID} style={{ flexDirection: 'row' }}>
      <View style={styles.container}>
        {canGoUp ? renderNav(true) : <></>}
        {canGoDown ? renderNav(false) : <></>}
        <Button onPress={() => Keyboard.dismiss()} {...btnProps}>
          Done
        </Button>
      </View>
    </InputAccessoryView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    margin: 5,
  },
  button: { borderRadius: 20, marginLeft: 10 },
});

export default InputNavAccessory;
