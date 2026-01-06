export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  videos: Video[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number; // in seconds
  order: number;
  quiz: Quiz;
}

export interface CourseCatalogItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoCount: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface CourseCatalog {
  courses: CourseCatalogItem[];
}

// Re-export Quiz type for convenience
export type { Quiz } from './quiz';
