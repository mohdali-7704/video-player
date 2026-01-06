'use client';

import { useEffect } from 'react';

interface UseVideoRestrictionsProps {
  onTabSwitch: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export function useVideoRestrictions({
  onTabSwitch,
  videoRef
}: UseVideoRestrictionsProps) {
  useEffect(() => {
    // Track visibility state
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched tabs/minimized window
        // Pause video immediately
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
        }
      } else {
        // User returned to tab
        // Trigger restart logic
        onTabSwitch();
      }
    };

    // Additional window blur detection
    const handleBlur = () => {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
        onTabSwitch();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [onTabSwitch, videoRef]);

  // Screenshot prevention (limited effectiveness)
  useEffect(() => {
    const preventScreenshot = (e: KeyboardEvent) => {
      // Attempt to block common screenshot shortcuts
      // Note: This is NOT foolproof but acts as deterrent
      if (
        (e.key === 'PrintScreen') ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) || // Mac
        (e.metaKey && e.shiftKey && e.key === 's') || // Windows Snip & Sketch
        (e.key === 'F12') || // DevTools
        (e.ctrlKey && e.shiftKey && e.key === 'I') // DevTools
      ) {
        e.preventDefault();
        // Show warning message
        console.warn('Screenshots and developer tools are not allowed during video playback');
        alert('Screenshots are not allowed while watching certification videos.');
      }
    };

    document.addEventListener('keydown', preventScreenshot);

    return () => {
      document.removeEventListener('keydown', preventScreenshot);
    };
  }, []);

  // Prevent context menu (right-click)
  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('contextmenu', preventContextMenu);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('contextmenu', preventContextMenu);
      }
    };
  }, [videoRef]);
}
