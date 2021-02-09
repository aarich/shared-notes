import { NavigationContainerRef } from '@react-navigation/native';
import { createRef } from 'react';

export const rootNavRef = createRef<NavigationContainerRef>();

export const navigateToEdit = (serializedFlow: string) => {
  rootNavRef.current?.navigate('Flows', {
    screen: 'EditScreen',
    params: { serializedFlow },
  });
};
