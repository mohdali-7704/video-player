import { UserProgress, CourseProgress, VideoProgress } from '@/lib/types/progress';

const STORAGE_KEY = 'course_progress';

export class ProgressManager {
  // Load all progress from localStorage
  static loadProgress(): UserProgress {
    if (typeof window === 'undefined') return { courses: {}, lastUpdated: '' };

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return { courses: {}, lastUpdated: new Date().toISOString() };
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load progress:', error);
      return { courses: {}, lastUpdated: new Date().toISOString() };
    }
  }

  // Save progress to localStorage
  static saveProgress(progress: UserProgress): void {
    if (typeof window === 'undefined') return;

    try {
      progress.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }

  // Get course progress
  static getCourseProgress(courseId: string): CourseProgress | null {
    const progress = this.loadProgress();
    return progress.courses[courseId] || null;
  }

  // Update video progress
  static updateVideoProgress(
    courseId: string,
    videoId: string,
    update: Partial<VideoProgress>
  ): void {
    const progress = this.loadProgress();

    if (!progress.courses[courseId]) {
      progress.courses[courseId] = {
        courseId,
        videosProgress: {},
        completedVideos: 0,
        totalVideos: 0
      };
    }

    const courseProgress = progress.courses[courseId];

    if (!courseProgress.videosProgress[videoId]) {
      courseProgress.videosProgress[videoId] = {
        videoId,
        courseId,
        currentTime: 0,
        maxWatchedTime: 0,
        completed: false,
        quizCompleted: false,
        lastWatched: new Date().toISOString()
      };
    }

    courseProgress.videosProgress[videoId] = {
      ...courseProgress.videosProgress[videoId],
      ...update,
      lastWatched: new Date().toISOString()
    };

    // Recalculate completed videos
    courseProgress.completedVideos = Object.values(courseProgress.videosProgress)
      .filter(v => v.completed && v.quizCompleted).length;

    this.saveProgress(progress);
  }

  // Get video progress
  static getVideoProgress(courseId: string, videoId: string): VideoProgress | null {
    const courseProgress = this.getCourseProgress(courseId);
    return courseProgress?.videosProgress[videoId] || null;
  }

  // Mark video as completed
  static markVideoCompleted(courseId: string, videoId: string): void {
    this.updateVideoProgress(courseId, videoId, {
      completed: true
    });
  }

  // Mark quiz as completed
  static markQuizCompleted(
    courseId: string,
    videoId: string,
    score: number
  ): void {
    this.updateVideoProgress(courseId, videoId, {
      quizCompleted: true,
      quizScore: score
    });
  }

  // Set total videos for course
  static setTotalVideos(courseId: string, totalVideos: number): void {
    const progress = this.loadProgress();

    if (!progress.courses[courseId]) {
      progress.courses[courseId] = {
        courseId,
        videosProgress: {},
        completedVideos: 0,
        totalVideos
      };
    } else {
      progress.courses[courseId].totalVideos = totalVideos;
    }

    this.saveProgress(progress);
  }
}
