import { NavigationContainerRef } from '@react-navigation/native';
import { createRef } from 'react';

export const rootNavRef = createRef<NavigationContainerRef>();

export const navigateToEdit = (slug: string) => {
  rootNavRef.current?.navigate('Library', {
    screen: 'EditScreen',
    params: { slug },
  });
};
