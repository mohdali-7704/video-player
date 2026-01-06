'use client';

import { useState, useEffect } from 'react';
import { CourseProgress, VideoProgress } from '@/lib/types/progress';
import { ProgressManager } from '@/lib/utils/progressManager';

export function useProgressTracking(courseId: string) {
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null);

  useEffect(() => {
    const progress = ProgressManager.getCourseProgress(courseId);
    setCourseProgress(progress);
  }, [courseId]);

  const updateVideoProgress = (
    videoId: string,
    update: Partial<VideoProgress>
  ) => {
    ProgressManager.updateVideoProgress(courseId, videoId, update);
    const updated = ProgressManager.getCourseProgress(courseId);
    setCourseProgress(updated);
  };

  const markVideoCompleted = (videoId: string) => {
    ProgressManager.markVideoCompleted(courseId, videoId);
    const updated = ProgressManager.getCourseProgress(courseId);
    setCourseProgress(updated);
  };

  const markQuizCompleted = (videoId: string, score: number) => {
    ProgressManager.markQuizCompleted(courseId, videoId, score);
    const updated = ProgressManager.getCourseProgress(courseId);
    setCourseProgress(updated);
  };

  const setTotalVideos = (total: number) => {
    ProgressManager.setTotalVideos(courseId, total);
    const updated = ProgressManager.getCourseProgress(courseId);
    setCourseProgress(updated);
  };

  return {
    courseProgress,
    updateVideoProgress,
    markVideoCompleted,
    markQuizCompleted,
    setTotalVideos
  };
}
