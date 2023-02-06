import { PermissionStatus, requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { useEffect, useState } from 'react';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import { updateSetting } from '../../redux/actions';
import { AdType, initialState } from '../../redux/reducers/settingsReducer';
import { useSetting } from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';
import { AdUnit, getAdId } from '../../utils/ads';

//                   ms     s <- m <- h <- d <- 7 days
const AD_RESET_DELAY_MS = 1000 * 60 * 60 * 24 * 7;

const PotentialAd = ({ unit }: { unit: AdUnit }) => {
  const dispatch = useAppDispatch();
  const adSetting = useSetting('ads');
  const adLastReset = useSetting('adLastReset');

  const [showAd, setShowAd] = useState(AdType.Off !== adSetting);
  const [showPersonalized, setShowPersonalized] = useState(false);

  useEffect(() => {
    const now = Date.now();
    if (adSetting === AdType.Off && now - adLastReset > AD_RESET_DELAY_MS) {
      dispatch(updateSetting({ ads: initialState.ads }));
    }
  }, [adLastReset, adSetting, dispatch]);

  useEffect(() => {
    setShowAd(AdType.Off !== adSetting);
  }, [adSetting]);

  useEffect(() => {
    if (showAd) {
      requestTrackingPermissionsAsync().then((resp) =>
        setShowPersonalized(resp.status === PermissionStatus.GRANTED)
      );
    }
  }, [dispatch, showAd]);

  if (!showAd) {
    return null;
  }

  return (
    <BannerAd
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      unitId={getAdId(unit)}
      requestOptions={{ requestNonPersonalizedAdsOnly: !showPersonalized }}
      onAdFailedToLoad={() => setShowAd(false)}
    />
  );
};

export default PotentialAd;
