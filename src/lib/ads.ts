import { Capacitor } from "@capacitor/core";
import { AdMob } from "@capacitor-community/admob";

// Google's public test ad unit IDs. Safe to ship, but they never earn real
// money — swap these for the real interstitial IDs from your own AdMob
// account (one app per platform) before publishing to the stores.
const INTERSTITIAL_AD_ID = {
  android: "ca-app-pub-3940256099942544/1033173712",
  ios: "ca-app-pub-3940256099942544/4411468910",
};

const MATCHES_PER_AD = 2;
const MATCH_COUNT_KEY = "gtp_matches_since_ad";

let initPromise: Promise<void> | null = null;
let interstitialReady = false;

function currentAdId() {
  return Capacitor.getPlatform() === "ios" ? INTERSTITIAL_AD_ID.ios : INTERSTITIAL_AD_ID.android;
}

async function prepareInterstitial() {
  try {
    await AdMob.prepareInterstitial({ adId: currentAdId() });
    interstitialReady = true;
  } catch {
    interstitialReady = false;
  }
}

// Boots the AdMob SDK once. Safe to call repeatedly; only does real work
// the first time, and never throws (ads must never block gameplay).
export function initAds() {
  if (!Capacitor.isNativePlatform()) return Promise.resolve();
  if (!initPromise) {
    initPromise = AdMob.initialize({ initializeForTesting: true })
      .then(prepareInterstitial)
      .catch(() => {});
  }
  return initPromise;
}

// Call once per finished match (solo round, duel, or room game). Shows an
// interstitial every MATCHES_PER_AD matches, then resets the counter.
export async function recordMatchFinished() {
  if (!Capacitor.isNativePlatform()) return;

  let count = MATCHES_PER_AD;
  try {
    count = Number(localStorage.getItem(MATCH_COUNT_KEY) || "0") + 1;
    localStorage.setItem(MATCH_COUNT_KEY, String(count));
  } catch {
    // localStorage unavailable — fall back to always showing on this call
  }

  if (count < MATCHES_PER_AD) return;

  try {
    localStorage.setItem(MATCH_COUNT_KEY, "0");
  } catch {
    // ignore — worst case the counter never resets in this session
  }

  await initAds();
  if (!interstitialReady) return;

  interstitialReady = false;
  try {
    await AdMob.showInterstitial();
  } catch {
    // ad failed to show (no fill, offline, etc.) — just continue the game
  } finally {
    prepareInterstitial();
  }
}
