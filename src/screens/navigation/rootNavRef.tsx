import { NavigationContainerRef } from '@react-navigation/native';
import { createRef } from 'react';
import { BottomTabParamList } from '../../utils/types';

export const rootNavRef =
  createRef<NavigationContainerRef<BottomTabParamList>>();

export const navigateToEdit = (slug: string) => {
  rootNavRef.current?.navigate('Notes', {
    screen: 'EditScreen',
    params: { slug },
  });
};
