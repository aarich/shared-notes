import { Animated, StyleSheet, View } from 'react-native';
import { Icon, ListItem, ListItemProps, useTheme } from '@ui-kitten/components';
import React, { useRef } from 'react';

import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

type Props = {
  onDelete: () => void;
} & ListItemProps;

const DeletableListItem = ({ onDelete, ...listItemProps }: Props) => {
  const theme = useTheme();
  const redColor = theme['color-danger-600'];
  const iconColor = theme['text-alternate-color'];
  const renderRightAction = (progress: Animated.AnimatedInterpolation) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [64, 0],
    });

    const pressHandler = () => {
      swipeableRow.current?.close();
      onDelete();
    };

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: redColor }]}
          onPress={pressHandler}
        >
          <Icon name="trash-2-outline" style={styles.icon} fill={iconColor} />
        </RectButton>
      </Animated.View>
    );
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation) => (
    <View
      style={{
        width: 64,
        flexDirection: 'row',
      }}
    >
      {renderRightAction(progress)}
    </View>
  );

  const swipeableRow = useRef<Swipeable>(null);

  return (
    <Swipeable
      ref={swipeableRow}
      friction={2}
      enableTrackpadTwoFingerGesture
      leftThreshold={30}
      rightThreshold={40}
      renderRightActions={renderRightActions}
    >
      <ListItem {...listItemProps} />
    </Swipeable>
  );
};

export default DeletableListItem;

const styles = StyleSheet.create({
  icon: { width: 30, height: 30 },
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
