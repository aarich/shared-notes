import * as Linking from 'expo-linking';

export default {
  prefixes: [
    Linking.makeUrl('/'),
    Linking.makeUrl('https://mrarich.com/flows'),
  ],
  config: {
    screens: {
      Root: {
        screens: {
          Timers: {
            screens: {
              LibraryScreen: '',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};
