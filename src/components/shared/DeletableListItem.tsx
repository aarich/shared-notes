import { Icon, ListItem, ListItemProps, useTheme } from '@ui-kitten/components';
import { useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

type Props = {
  onDelete: () => void;
} & ListItemProps;

const DeletableListItem = ({ onDelete, ...listItemProps }: Props) => {
  const theme = useTheme();
  const redColor = theme['color-danger-600'];
  const iconColor = theme['text-alternate-color'];
  const swipeableRow = useRef<Swipeable>(null);

  const renderRightAction = (progress: Animated.AnimatedInterpolation) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [64, 0],
    });

    const pressHandler = () => {
      swipeableRow.current?.close();
      onDelete();
    };

    const viewStyle = { flex: 1, transform: [{ translateX: trans }] };

    return (
      <Animated.View style={viewStyle}>
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
    <View style={styles.rightActionContainer}>
      {renderRightAction(progress)}
    </View>
  );

  return (
    <Swipeable
      ref={swipeableRow}
      friction={2}
      enableTrackpadTwoFingerGesture
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
  rightActionContainer: {
    width: 64,
    flexDirection: 'row',
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
