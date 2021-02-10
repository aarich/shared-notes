import { ButtonElement } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';

interface ButtonSwitchProps extends ViewProps {
  fullWidth?: boolean;
  children: ButtonElement[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export type ButtonSwitchElement = React.ReactElement<ButtonSwitchProps>;

const STATUS_DEFAULT = 'basic';
const STATUS_SELECTED = 'primary';
const APPEARANCE_DEFAULT = 'outline';
const APPEARANCE_SELECTED = 'filled';

/**
 * Courtesy of https://gist.github.com/artyorsh/f4521fb53ade5dad5a6c880f7785e971
 */
const ButtonPicker = ({
  children,
  fullWidth,
  selectedIndex,
  onSelect,
  style,
  ...viewProps
}: ButtonSwitchProps) => {
  const childCount = React.Children.count(children);

  const getBorderStyleForPosition = (index: number) => {
    switch (index) {
      case 0:
        return styles.firstButton;
      case childCount - 1:
        return styles.lastButton;
      default:
        return styles.middleButton;
    }
  };

  const renderComponentChildren = (children: ButtonElement[]) => {
    return React.Children.map(
      children,
      (element: ButtonElement, index: number): ButtonElement => {
        const borderStyle: ViewStyle = getBorderStyleForPosition(index);

        return React.cloneElement(element, {
          style: [
            element.props.style,
            borderStyle,
            fullWidth && styles.buttonFullWidth,
          ],
          status: index === selectedIndex ? STATUS_SELECTED : STATUS_DEFAULT,
          appearance:
            index === selectedIndex ? APPEARANCE_SELECTED : APPEARANCE_DEFAULT,
          onPress: () => onSelect(index),
        });
      }
    );
  };
  return (
    <View {...viewProps} style={[styles.container, style]}>
      {renderComponentChildren(children)}
    </View>
  );
};

export default ButtonPicker;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  firstButton: {
    borderTopEndRadius: 0,
    borderBottomEndRadius: 0,
  },
  middleButton: {
    borderRadius: 0,
  },
  lastButton: {
    borderTopStartRadius: 0,
    borderBottomStartRadius: 0,
  },
  buttonFullWidth: {
    flex: 1,
  },
});
