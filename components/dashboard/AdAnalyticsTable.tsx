'use client';

import { useState } from 'react';
import { AdAnalytics } from '@/lib/types/ad';

interface AdAnalyticsTableProps {
  analytics: AdAnalytics[];
}

type SortField = 'title' | 'impressions' | 'clicks' | 'ctr' | 'skipRate' | 'completionRate' | 'avgWatchTime';
type SortDirection = 'asc' | 'desc';

export default function AdAnalyticsTable({ analytics }: AdAnalyticsTableProps) {
  const [sortField, setSortField] = useState<SortField>('impressions');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter and sort analytics
  const filteredAndSorted = analytics
    .filter((ad) =>
      ad.adId.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortField) {
        case 'impressions':
          aValue = a.totalImpressions;
          bValue = b.totalImpressions;
          break;
        case 'clicks':
          aValue = a.totalClicks;
          bValue = b.totalClicks;
          break;
        case 'ctr':
          aValue = a.ctr;
          bValue = b.ctr;
          break;
        case 'skipRate':
          aValue = a.skipRate;
          bValue = b.skipRate;
          break;
        case 'completionRate':
          aValue = a.completionRate;
          bValue = b.completionRate;
          break;
        case 'avgWatchTime':
          aValue = a.averageWatchTime;
          bValue = b.averageWatchTime;
          break;
        default:
          aValue = 0;
          bValue = 0;
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

  // Helper to get color class based on metric value
  const getCtrColor = (ctr: number) => {
    if (ctr >= 5) return 'text-green-600 font-semibold';
    if (ctr >= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSkipRateColor = (skipRate: number) => {
    if (skipRate <= 30) return 'text-green-600 font-semibold';
    if (skipRate <= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompletionRateColor = (completionRate: number) => {
    if (completionRate >= 50) return 'text-green-600 font-semibold';
    if (completionRate >= 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (analytics.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data Yet</h3>
        <p className="text-gray-600">
          Watch some videos with ads to start collecting analytics data.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search by Ad ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('title')}
              >
                Ad ID {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('impressions')}
              >
                Impressions {sortField === 'impressions' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('clicks')}
              >
                Clicks {sortField === 'clicks' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('ctr')}
              >
                CTR {sortField === 'ctr' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('skipRate')}
              >
                Skip Rate {sortField === 'skipRate' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('completionRate')}
              >
                Completion {sortField === 'completionRate' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('avgWatchTime')}
              >
                Avg Watch Time {sortField === 'avgWatchTime' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSorted.map((ad) => (
              <tr key={ad.adId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {ad.adId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ad.totalImpressions.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ad.totalClicks.toLocaleString()}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${getCtrColor(ad.ctr)}`}>
                  {ad.ctr.toFixed(2)}%
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${getSkipRateColor(ad.skipRate)}`}>
                  {ad.skipRate.toFixed(2)}%
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${getCompletionRateColor(ad.completionRate)}`}>
                  {ad.completionRate.toFixed(2)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ad.averageWatchTime.toFixed(1)}s
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSorted.length === 0 && searchQuery && (
        <div className="p-8 text-center text-gray-500">
          No ads found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}
