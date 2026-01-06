'use client';

import { useRef, useState, useEffect } from 'react';
import { useVideoRestrictions } from '@/lib/hooks/useVideoRestrictions';
import { VideoProgress } from '@/lib/types/progress';
import VideoControls from './VideoControls';

interface RestrictedVideoPlayerProps {
  videoUrl: string;
  videoId: string;
  courseId: string;
  initialProgress?: VideoProgress | null;
  onProgressUpdate: (progress: Partial<VideoProgress>) => void;
  onVideoComplete: () => void;
}

export default function RestrictedVideoPlayer({
  videoUrl,
  videoId,
  courseId,
  initialProgress,
  onProgressUpdate,
  onVideoComplete
}: RestrictedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialProgress?.currentTime || 0);
  const [duration, setDuration] = useState(0);
  const [maxWatchedTime, setMaxWatchedTime] = useState(initialProgress?.maxWatchedTime || 0);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle tab switch - restart video
  const handleTabSwitch = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      setMaxWatchedTime(0);
      setIsPlaying(false);

      // Update progress
      onProgressUpdate({
        currentTime: 0,
        maxWatchedTime: 0
      });
    }
  };

  // Use video restrictions hook
  useVideoRestrictions({
    onTabSwitch: handleTabSwitch,
    videoRef
  });

  // Initialize video on load
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      // Restore previous position if available
      if (initialProgress?.currentTime) {
        video.currentTime = initialProgress.currentTime;
        setCurrentTime(initialProgress.currentTime);
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [initialProgress]);

  // Track time updates
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const current = videoRef.current.currentTime;
    setCurrentTime(current);

    // Update max watched time if we've progressed further
    if (current > maxWatchedTime) {
      setMaxWatchedTime(current);

      // Save progress periodically
      onProgressUpdate({
        currentTime: current,
        maxWatchedTime: current
      });
    }
  };

  // Prevent forward seeking
  const handleSeeking = () => {
    if (!videoRef.current) return;

    const seekTime = videoRef.current.currentTime;

    // If trying to seek beyond max watched time, reset to max
    if (seekTime > maxWatchedTime) {
      videoRef.current.currentTime = maxWatchedTime;
      setCurrentTime(maxWatchedTime);
    }
  };

  // Handle video end
  const handleVideoEnd = () => {
    setIsPlaying(false);
    setVideoCompleted(true);

    // Mark video as completed
    onProgressUpdate({
      completed: true,
      currentTime: duration,
      maxWatchedTime: duration
    });

    // Notify parent
    onVideoComplete();
  };

  // Play/Pause handlers
  const handlePlay = () => {
    videoRef.current?.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    videoRef.current?.pause();
    setIsPlaying(false);
  };

  // Seek handler
  const handleSeek = (time: number) => {
    if (videoRef.current && time <= maxWatchedTime) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Rewind handler
  const handleRewind = (seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, currentTime - seconds);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Fullscreen handlers
  const handleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full bg-black ${isFullscreen ? 'h-screen flex flex-col' : ''}`}
    >
      {/* Video Element */}
      <div className={`relative bg-black flex items-center justify-center w-full ${
        isFullscreen ? 'flex-1 h-full' : 'max-h-[70vh]'
      }`}>
        <video
          ref={videoRef}
          src={videoUrl}
          className={`object-contain ${isFullscreen ? 'w-full h-full' : 'w-full max-h-[70vh]'}`}
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          onTimeUpdate={handleTimeUpdate}
          onSeeking={handleSeeking}
          onEnded={handleVideoEnd}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          style={{ userSelect: 'none' }}
        />

        {/* Overlay to prevent right-click */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ userSelect: 'none' }}
        />
      </div>

      {/* Custom Controls */}
      <div className={isFullscreen ? 'w-full' : 'w-full'}>
        <VideoControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          maxWatchedTime={maxWatchedTime}
          isFullscreen={isFullscreen}
          onPlay={handlePlay}
          onPause={handlePause}
          onSeek={handleSeek}
          onRewind={handleRewind}
          onFullscreen={handleFullscreen}
        />
      </div>

      {/* Completion Message */}
      {videoCompleted && (
        <div className="bg-green-600 text-white text-center py-2 px-4">
          Video completed! Please complete the quiz below to proceed.
        </div>
      )}
    </div>
  );
}
