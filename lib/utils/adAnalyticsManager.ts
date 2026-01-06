import { AdAnalytics, AdView } from '@/lib/types/ad';
import { STORAGE_KEYS, AD_CONFIG } from '@/lib/config/adConfig';

interface AnalyticsStorage {
  [adId: string]: AdAnalytics;
}

export class AdAnalyticsManager {
  // Load all analytics from localStorage
  static loadAnalytics(): AnalyticsStorage {
    if (typeof window === 'undefined') return {};

    try {
      const data = localStorage.getItem(STORAGE_KEYS.AD_ANALYTICS);
      if (!data) return {};
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load ad analytics:', error);
      return {};
    }
  }

  // Save analytics to localStorage
  static saveAnalytics(analytics: AnalyticsStorage): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEYS.AD_ANALYTICS, JSON.stringify(analytics));
    } catch (error) {
      console.error('Failed to save ad analytics:', error);
    }
  }

  // Get analytics for a specific ad
  static getAdAnalytics(adId: string): AdAnalytics {
    const allAnalytics = this.loadAnalytics();

    if (!allAnalytics[adId]) {
      // Initialize analytics for new ad
      return {
        adId,
        totalImpressions: 0,
        totalClicks: 0,
        totalSkips: 0,
        totalCompletions: 0,
        totalWatchTime: 0,
        ctr: 0,
        skipRate: 0,
        completionRate: 0,
        averageWatchTime: 0,
        lastUpdated: new Date().toISOString(),
        views: [],
      };
    }

    return allAnalytics[adId];
  }

  // Get all ad analytics
  static getAllAnalytics(): AnalyticsStorage {
    return this.loadAnalytics();
  }

  // Track ad start (impression)
  static trackAdStart(adId: string, videoId?: string, courseId?: string): void {
    const analytics = this.getAdAnalytics(adId);

    const view: AdView = {
      id: `${adId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      adId,
      timestamp: new Date().toISOString(),
      watchTime: 0,
      completed: false,
      skipped: false,
      clicked: false,
      videoId,
      courseId,
    };

    analytics.views.push(view);
    analytics.totalImpressions++;

    this.recalculateMetrics(analytics);
    this.saveAdAnalytics(analytics);
  }

  // Track ad skip
  static trackAdSkip(adId: string, watchTime: number): void {
    const analytics = this.getAdAnalytics(adId);

    // Find the most recent view for this ad
    const latestView = analytics.views[analytics.views.length - 1];
    if (latestView && latestView.adId === adId) {
      latestView.skipped = true;
      latestView.watchTime = watchTime;
      latestView.skipTime = watchTime;
      analytics.totalSkips++;
    }

    this.recalculateMetrics(analytics);
    this.saveAdAnalytics(analytics);
  }

  // Track ad completion
  static trackAdCompletion(adId: string, watchTime: number): void {
    const analytics = this.getAdAnalytics(adId);

    // Find the most recent view for this ad
    const latestView = analytics.views[analytics.views.length - 1];
    if (latestView && latestView.adId === adId) {
      latestView.completed = true;
      latestView.watchTime = watchTime;
      analytics.totalCompletions++;
    }

    this.recalculateMetrics(analytics);
    this.saveAdAnalytics(analytics);
  }

  // Track ad click
  static trackAdClick(adId: string): void {
    const analytics = this.getAdAnalytics(adId);

    // Find the most recent view for this ad
    const latestView = analytics.views[analytics.views.length - 1];
    if (latestView && latestView.adId === adId) {
      latestView.clicked = true;
      analytics.totalClicks++;
    }

    this.recalculateMetrics(analytics);
    this.saveAdAnalytics(analytics);
  }

  // Recalculate all metrics from views
  private static recalculateMetrics(analytics: AdAnalytics): void {
    const impressions = analytics.totalImpressions;

    if (impressions === 0) {
      analytics.ctr = 0;
      analytics.skipRate = 0;
      analytics.completionRate = 0;
      analytics.averageWatchTime = 0;
      return;
    }

    // Calculate total watch time from views
    analytics.totalWatchTime = analytics.views.reduce((sum, view) => sum + view.watchTime, 0);

    // Calculate metrics
    analytics.ctr = (analytics.totalClicks / impressions) * 100;
    analytics.skipRate = (analytics.totalSkips / impressions) * 100;
    analytics.completionRate = (analytics.totalCompletions / impressions) * 100;
    analytics.averageWatchTime = analytics.totalWatchTime / impressions;

    analytics.lastUpdated = new Date().toISOString();
  }

  // Save analytics for a specific ad
  private static saveAdAnalytics(analytics: AdAnalytics): void {
    // Prune old views if exceeding limit
    if (analytics.views.length > AD_CONFIG.maxViewsPerAd) {
      analytics.views = analytics.views.slice(-AD_CONFIG.maxViewsPerAd);
    }

    const allAnalytics = this.loadAnalytics();
    allAnalytics[analytics.adId] = analytics;
    this.saveAnalytics(allAnalytics);
  }

  // Calculate aggregate metrics across all ads
  static getAggregateMetrics(): {
    totalImpressions: number;
    totalClicks: number;
    totalSkips: number;
    totalCompletions: number;
    averageCtr: number;
    averageSkipRate: number;
    averageCompletionRate: number;
    totalAds: number;
  } {
    const allAnalytics = this.getAllAnalytics();
    const adIds = Object.keys(allAnalytics);

    if (adIds.length === 0) {
      return {
        totalImpressions: 0,
        totalClicks: 0,
        totalSkips: 0,
        totalCompletions: 0,
        averageCtr: 0,
        averageSkipRate: 0,
        averageCompletionRate: 0,
        totalAds: 0,
      };
    }

    let totalImpressions = 0;
    let totalClicks = 0;
    let totalSkips = 0;
    let totalCompletions = 0;
    let sumCtr = 0;
    let sumSkipRate = 0;
    let sumCompletionRate = 0;

    adIds.forEach(adId => {
      const analytics = allAnalytics[adId];
      totalImpressions += analytics.totalImpressions;
      totalClicks += analytics.totalClicks;
      totalSkips += analytics.totalSkips;
      totalCompletions += analytics.totalCompletions;
      sumCtr += analytics.ctr;
      sumSkipRate += analytics.skipRate;
      sumCompletionRate += analytics.completionRate;
    });

    return {
      totalImpressions,
      totalClicks,
      totalSkips,
      totalCompletions,
      averageCtr: sumCtr / adIds.length,
      averageSkipRate: sumSkipRate / adIds.length,
      averageCompletionRate: sumCompletionRate / adIds.length,
      totalAds: adIds.length,
    };
  }

  // Clear all analytics (for testing/reset)
  static clearAllAnalytics(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.AD_ANALYTICS);
  }
}
