import { NavigationContainerRef } from '@react-navigation/native';
import { createRef } from 'react';

export const rootNavRef = createRef<NavigationContainerRef>();

export const navigateToEdit = (slug: string) => {
  rootNavRef.current?.navigate('Notes', {
    screen: 'EditScreen',
    params: { slug },
  });
};
