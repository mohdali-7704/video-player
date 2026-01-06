'use client';

import { useRef, useState, useEffect } from 'react';
import { Ad } from '@/lib/types/ad';
import { AdAnalyticsManager } from '@/lib/utils/adAnalyticsManager';
import { AD_CONFIG } from '@/lib/config/adConfig';

interface AdPlayerProps {
  ad: Ad;
  onComplete: () => void;
  onError: () => void;
  videoId?: string;
  courseId?: string;
}

export default function AdPlayer({
  ad,
  onComplete,
  onError,
  videoId,
  courseId,
}: AdPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(ad.duration);
  const [skipEnabled, setSkipEnabled] = useState(false);
  const [adStarted, setAdStarted] = useState(false);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);

  // Track impression when video starts playing
  useEffect(() => {
    if (adStarted && !hasTrackedImpression) {
      AdAnalyticsManager.trackAdStart(ad.id, videoId, courseId);
      setHasTrackedImpression(true);
    }
  }, [adStarted, hasTrackedImpression, ad.id, videoId, courseId]);

  // Save partial analytics before page unload
  useEffect(() => {
    const savePartialAnalytics = () => {
      if (adStarted && currentTime > 0) {
        // If user leaves during ad, count as skip
        AdAnalyticsManager.trackAdSkip(ad.id, currentTime);
      }
    };

    window.addEventListener('beforeunload', savePartialAnalytics);
    return () => window.removeEventListener('beforeunload', savePartialAnalytics);
  }, [adStarted, currentTime, ad.id]);

  // Attempt to play video after mounting
  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.error('Failed to autoplay ad video:', error);
          // Try playing anyway, the video element has autoPlay attribute
        }
      }
    };

    playVideo();
  }, []);

  // Load timeout - if ad doesn't load in time, skip to main video
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!adStarted) {
        console.warn('Ad load timeout, skipping to main video');
        onError();
      }
    }, AD_CONFIG.loadTimeout);

    return () => clearTimeout(timeout);
  }, [adStarted, onError]);

  // Handle video metadata loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Handle video playing
  const handlePlay = () => {
    setAdStarted(true);
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const current = videoRef.current.currentTime;
    setCurrentTime(current);

    // Enable skip button after skipDelay seconds
    if (current >= ad.skipDelay && !skipEnabled) {
      setSkipEnabled(true);
    }
  };

  // Handle video end (completion)
  const handleVideoEnd = () => {
    AdAnalyticsManager.trackAdCompletion(ad.id, currentTime);
    onComplete();
  };

  // Handle video error
  const handleVideoError = () => {
    console.error('Ad video failed to load:', ad.id);
    onError();
  };

  // Handle skip button click
  const handleSkip = () => {
    AdAnalyticsManager.trackAdSkip(ad.id, currentTime);
    onComplete();
  };

  // Handle CTA button click
  const handleCtaClick = () => {
    AdAnalyticsManager.trackAdClick(ad.id);
    // Open target URL in new tab
    window.open(ad.ctaUrl, '_blank', 'noopener,noreferrer');
  };

  // Calculate remaining time until skip is available
  const remainingSkipTime = Math.max(0, Math.ceil(ad.skipDelay - currentTime));
  const timeRemaining = Math.ceil(duration - currentTime);

  return (
    <div className="w-full bg-black relative">
      {/* Video Element */}
      <div className="relative bg-black flex items-center justify-center w-full max-h-[70vh]">
        <video
          ref={videoRef}
          src={ad.videoUrl}
          className="object-contain w-full max-h-[70vh]"
          autoPlay
          muted
          playsInline
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={handlePlay}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnd}
          onError={handleVideoError}
          style={{ userSelect: 'none' }}
        />

        {/* Ad Badge and Countdown */}
        <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded text-sm font-semibold">
          Ad {timeRemaining > 0 && `• ${timeRemaining}s`}
        </div>

        {/* Skip Button */}
        {skipEnabled ? (
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded transition-all"
          >
            Skip Ad →
          </button>
        ) : (
          <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-60 text-gray-300 px-4 py-2 rounded text-sm">
            Skip in {remainingSkipTime}s
          </div>
        )}

        {/* CTA Button Overlay */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <button
            onClick={handleCtaClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all transform hover:scale-105"
          >
            {ad.ctaText}
          </button>
        </div>

        {/* Ad Info Overlay (bottom left) */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded max-w-xs">
          <div className="text-sm font-semibold">{ad.title}</div>
          <div className="text-xs text-gray-300 mt-1">{ad.description}</div>
        </div>
      </div>
    </div>
  );
}
