import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from './src/redux/store';
import Navigation from './src/screens/navigation/Navigation';

mobileAds()
  .setRequestConfiguration({ maxAdContentRating: MaxAdContentRating.G })
  .then(() => mobileAds().initialize());

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navigation />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
