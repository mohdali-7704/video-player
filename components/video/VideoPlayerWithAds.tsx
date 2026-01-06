'use client';

import { useState, useEffect } from 'react';
import RestrictedVideoPlayer from './RestrictedVideoPlayer';
import AdPlayer from '../ad/AdPlayer';
import { AdLoader } from '@/lib/utils/adLoader';
import { Ad } from '@/lib/types/ad';
import { VideoProgress } from '@/lib/types/progress';

interface VideoPlayerWithAdsProps {
  videoUrl: string;
  videoId: string;
  courseId: string;
  initialProgress?: VideoProgress | null;
  onProgressUpdate: (progress: Partial<VideoProgress>) => void;
  onVideoComplete: () => void;
}

export default function VideoPlayerWithAds(props: VideoPlayerWithAdsProps) {
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [adCompleted, setAdCompleted] = useState(false);
  const [adError, setAdError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load ad on mount
  useEffect(() => {
    const loadAd = async () => {
      try {
        const ads = await AdLoader.loadAds();
        const ad = AdLoader.getRandomAd(ads);
        if (ad) {
          setCurrentAd(ad);
        } else {
          // No ads available, skip to main video
          console.warn('No ads available, proceeding to main video');
          setAdCompleted(true);
        }
      } catch (error) {
        console.error('Error loading ad:', error);
        setAdCompleted(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadAd();
  }, []);

  const handleAdComplete = () => {
    setAdCompleted(true);
  };

  const handleAdError = () => {
    setAdError(true);
    setAdCompleted(true); // Skip to main video on error
  };

  // Show loading state while ad is being loaded
  if (isLoading) {
    return (
      <div className="w-full bg-black flex items-center justify-center" style={{ height: '70vh' }}>
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show ad first if not completed
  if (!adCompleted && currentAd) {
    return (
      <AdPlayer
        ad={currentAd}
        onComplete={handleAdComplete}
        onError={handleAdError}
        videoId={props.videoId}
        courseId={props.courseId}
      />
    );
  }

  // Show main video after ad
  return <RestrictedVideoPlayer {...props} />;
}
