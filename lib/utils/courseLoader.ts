import { Course, CourseCatalog, Video } from '@/lib/types/course';

export class CourseLoader {
  // Get base URL for fetch requests
  private static getBaseUrl(): string {
    // For server-side rendering
    if (typeof window === 'undefined') {
      return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    }
    // For client-side
    return window.location.origin;
  }

  // Load course catalog (list of all courses)
  static async loadCatalog(): Promise<CourseCatalog> {
    try {
      const url = `${this.getBaseUrl()}/data/courses/index.json`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load course catalog');
      return await response.json();
    } catch (error) {
      console.error('Error loading course catalog:', error);
      return { courses: [] };
    }
  }

  // Load specific course data
  static async loadCourse(courseId: string): Promise<Course | null> {
    try {
      const url = `${this.getBaseUrl()}/data/courses/${courseId}.json`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to load course ${courseId}`);
      return await response.json();
    } catch (error) {
      console.error(`Error loading course ${courseId}:`, error);
      return null;
    }
  }

  // Get video from course
  static getVideo(course: Course, videoId: string): Video | null {
    return course.videos.find(v => v.id === videoId) || null;
  }

  // Get next video in sequence
  static getNextVideo(course: Course, currentVideoId: string): Video | null {
    const currentIndex = course.videos.findIndex(v => v.id === currentVideoId);
    if (currentIndex === -1 || currentIndex === course.videos.length - 1) {
      return null;
    }
    return course.videos[currentIndex + 1];
  }

  // Get previous video in sequence
  static getPreviousVideo(course: Course, currentVideoId: string): Video | null {
    const currentIndex = course.videos.findIndex(v => v.id === currentVideoId);
    if (currentIndex <= 0) {
      return null;
    }
    return course.videos[currentIndex - 1];
  }
}
