import { Quiz } from './quiz';

// ============== LEGACY TYPES (Backward Compatibility) ==============
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

// ============== NEW TYPES (Udemy-Style Structure) ==============

// Enhanced Course with sections and lectures
export interface EnhancedCourse {
  // Basic Info
  id: string;
  title: string;
  subtitle: string;
  description: string;
  instructor: string;
  thumbnail: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  language: string;

  // Learning objectives
  whatYouWillLearn: string[];
  requirements: string[];

  // Status
  published: boolean;
  createdAt: string;
  updatedAt: string;

  // Content
  sections: Section[];
}

// Section contains multiple lectures
export interface Section {
  id: string;
  title: string;
  order: number;
  lectures: Lecture[];
}

// Lecture with different content types
export interface Lecture {
  id: string;
  title: string;
  description: string;
  order: number;
  type: 'video' | 'article' | 'quiz' | 'resource';
  duration: number; // in seconds
  content: VideoContent | ArticleContent | QuizContent | ResourceContent;
  resources?: LectureResource[]; // Downloadable files
  canPreview: boolean; // Free preview
}

// Content type interfaces
export interface VideoContent {
  type: 'video';
  videoUrl: string; // Can be upload or external URL
}

export interface ArticleContent {
  type: 'article';
  content: string; // HTML or Markdown
}

export interface QuizContent {
  type: 'quiz';
  quiz: Quiz;
}

export interface ResourceContent {
  type: 'resource';
  description: string;
}

// Downloadable resources attached to lectures
export interface LectureResource {
  id: string;
  title: string;
  type: 'pdf' | 'ppt' | 'pptx' | 'doc' | 'docx' | 'zip' | 'other';
  fileUrl: string;
  fileSize: number; // in bytes
}

// Type guard to check if course is enhanced
export function isEnhancedCourse(course: Course | EnhancedCourse): course is EnhancedCourse {
  return 'sections' in course && Array.isArray((course as EnhancedCourse).sections);
}

// Re-export Quiz type for convenience
export type { Quiz };
