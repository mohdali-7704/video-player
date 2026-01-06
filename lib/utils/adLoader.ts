import { Ad, AdsData } from '@/lib/types/ad';

export class AdLoader {
  // Load ads from JSON file
  static async loadAds(): Promise<Ad[]> {
    try {
      const response = await fetch('/data/ads/ads.json');

      if (!response.ok) {
        throw new Error('Failed to load ads');
      }

      const data: AdsData = await response.json();

      if (!data.ads || data.ads.length === 0) {
        console.warn('No ads available');
        return [];
      }

      // Filter only active ads
      return data.ads.filter(ad => ad.active);
    } catch (error) {
      console.error('Error loading ads:', error);
      return []; // Return empty array, don't crash
    }
  }

  // Select a random ad from the available ads
  static getRandomAd(ads: Ad[]): Ad | null {
    if (ads.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * ads.length);
    return ads[randomIndex];
  }
}
