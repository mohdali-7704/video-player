'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCard from '@/components/dashboard/StatCard';
import AdAnalyticsTable from '@/components/dashboard/AdAnalyticsTable';
import { AdAnalyticsManager } from '@/lib/utils/adAnalyticsManager';
import { AdAnalytics } from '@/lib/types/ad';

export default function AdAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AdAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load analytics data
  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    setIsLoading(true);
    const allAnalytics = AdAnalyticsManager.getAllAnalytics();
    const analyticsArray = Object.values(allAnalytics);
    setAnalytics(analyticsArray);
    setIsLoading(false);
  };

  // Calculate aggregate metrics
  const aggregateMetrics = AdAnalyticsManager.getAggregateMetrics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Ad Analytics"
        subtitle="Track and analyze your ad performance"
      />

      <div className="flex-1 overflow-auto p-8">
        {/* Summary Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Impressions"
            value={aggregateMetrics.totalImpressions.toLocaleString()}
            icon="👁️"
            subtitle="Ad views"
          />
          <StatCard
            title="Total Clicks"
            value={aggregateMetrics.totalClicks.toLocaleString()}
            icon="👆"
            subtitle="CTA clicks"
          />
          <StatCard
            title="Average CTR"
            value={`${aggregateMetrics.averageCtr.toFixed(2)}%`}
            icon="📊"
            subtitle="Click-through rate"
          />
          <StatCard
            title="Active Ads"
            value={aggregateMetrics.totalAds}
            icon="📺"
            subtitle="Ads tracked"
          />
        </div>

        {/* Additional Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Avg Skip Rate"
            value={`${aggregateMetrics.averageSkipRate.toFixed(2)}%`}
            icon="⏭️"
            subtitle="Users who skipped"
          />
          <StatCard
            title="Avg Completion Rate"
            value={`${aggregateMetrics.averageCompletionRate.toFixed(2)}%`}
            icon="✅"
            subtitle="Users who watched fully"
          />
          <StatCard
            title="Total Skips"
            value={aggregateMetrics.totalSkips.toLocaleString()}
            icon="⏩"
            subtitle="Skip button clicks"
          />
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Ad Performance Table</h2>
          <button
            onClick={loadAnalytics}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <span>🔄</span>
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Ad Analytics Table */}
        <AdAnalyticsTable analytics={analytics} />

        {/* Color Legend */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Performance Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">CTR (Click-Through Rate):</span>
              <div className="mt-1 space-y-1">
                <div className="text-green-600">• ≥ 5%: Excellent</div>
                <div className="text-yellow-600">• 2-5%: Good</div>
                <div className="text-red-600">• &lt; 2%: Needs Improvement</div>
              </div>
            </div>
            <div>
              <span className="font-medium">Skip Rate:</span>
              <div className="mt-1 space-y-1">
                <div className="text-green-600">• ≤ 30%: Excellent</div>
                <div className="text-yellow-600">• 30-60%: Good</div>
                <div className="text-red-600">• &gt; 60%: Needs Improvement</div>
              </div>
            </div>
            <div>
              <span className="font-medium">Completion Rate:</span>
              <div className="mt-1 space-y-1">
                <div className="text-green-600">• ≥ 50%: Excellent</div>
                <div className="text-yellow-600">• 25-50%: Good</div>
                <div className="text-red-600">• &lt; 25%: Needs Improvement</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
