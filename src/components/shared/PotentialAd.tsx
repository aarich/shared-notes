import { AdType, initialState } from '../../redux/reducers/settingsReducer';
import { AdUnit, getAdId } from '../../utils/ads';
import React, { useEffect, useState } from 'react';

import { AdMobBanner } from 'expo-ads-admob';
import { updateSetting } from '../../redux/actions';
import { useAppDispatch } from '../../redux/store';
import { useSetting } from '../../redux/selectors';

//                   ms     s <- m <- h <- d <- 3 days
const AD_RESET_DELAY_MS = 1000 * 60 * 60 * 24 * 3;

const PotentialAd = ({ unit }: { unit: AdUnit }) => {
  const dispatch = useAppDispatch();
  const adSetting = useSetting('ads');
  const adLastReset = useSetting('adLastReset');

  const [showAd, setShowAd] = useState(AdType.Off !== adSetting);

  useEffect(() => {
    const now = Date.now();
    if (adSetting === AdType.Off && now - adLastReset > AD_RESET_DELAY_MS) {
      dispatch(updateSetting({ ads: initialState.ads }));
    }
  }, [adLastReset, adSetting, dispatch]);

  useEffect(() => {
    setShowAd(AdType.Off !== adSetting);
  }, [adSetting]);

  return showAd ? (
    <AdMobBanner
      bannerSize="smartBannerPortrait"
      adUnitID={getAdId(unit)}
      servePersonalizedAds={adSetting === AdType.Personal}
      onDidFailToReceiveAdWithError={() => setShowAd(false)}
    />
  ) : null;
};

export default PotentialAd;
