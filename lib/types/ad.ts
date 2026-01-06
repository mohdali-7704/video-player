// Ad definition from ads.json
export interface Ad {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number; // in seconds
  ctaText: string;
  ctaUrl: string;
  skipDelay: number; // seconds before skip is allowed
  active: boolean; // flag to enable/disable ads
}

// Individual ad view record
export interface AdView {
  id: string; // unique view ID
  adId: string;
  timestamp: string; // ISO date string
  watchTime: number; // seconds watched
  completed: boolean; // watched to the end
  skipped: boolean;
  skipTime?: number; // when skip button was pressed (seconds)
  clicked: boolean;
  videoId?: string; // which main video triggered this ad
  courseId?: string;
}

// Aggregated analytics for a single ad
export interface AdAnalytics {
  adId: string;
  totalImpressions: number;
  totalClicks: number;
  totalSkips: number;
  totalCompletions: number;
  totalWatchTime: number; // cumulative seconds
  ctr: number; // clicks / impressions * 100
  skipRate: number; // skips / impressions * 100
  completionRate: number; // completions / impressions * 100
  averageWatchTime: number; // totalWatchTime / impressions
  lastUpdated: string;
  views: AdView[]; // array of individual views
}

// Container for ads.json data
export interface AdsData {
  ads: Ad[];
}
