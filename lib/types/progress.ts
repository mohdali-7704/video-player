export interface VideoProgress {
  videoId: string;
  courseId: string;
  currentTime: number;
  maxWatchedTime: number; // highest time reached (for seek prevention)
  completed: boolean;
  quizCompleted: boolean;
  quizScore?: number;
  lastWatched: string; // ISO date string
}

export interface CourseProgress {
  courseId: string;
  videosProgress: Record<string, VideoProgress>;
  completedVideos: number;
  totalVideos: number;
  lastAccessedVideoId?: string;
}

export interface UserProgress {
  courses: Record<string, CourseProgress>;
  lastUpdated: string;
}
