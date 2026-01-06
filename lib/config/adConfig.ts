export const AD_CONFIG = {
  skipDelay: 5, // seconds before skip button appears
  loadTimeout: 10000, // milliseconds to wait for ad to load
  maxViewsPerAd: 1000, // rotate old views to prevent storage overflow
  trackingEnabled: true,
} as const;

export const STATIC_CREDENTIALS = {
  username: "admin",
  password: "admin123",
} as const;

export const STORAGE_KEYS = {
  AD_ANALYTICS: 'ad_analytics',
  ADMIN_AUTH: 'admin_auth',
} as const;
