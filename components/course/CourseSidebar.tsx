'use client';

import Link from 'next/link';
import { Course } from '@/lib/types/course';
import { CourseProgress } from '@/lib/types/progress';

interface CourseSidebarProps {
  course: Course;
  currentVideoId: string;
  progress: CourseProgress | null;
}

export default function CourseSidebar({
  course,
  currentVideoId,
  progress
}: CourseSidebarProps) {
  const completedCount = progress?.completedVideos || 0;
  const totalCount = course.videos.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <aside className="w-80 bg-gray-800 text-white flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 text-sm mb-2 block"
        >
          ← Back to Courses
        </Link>
        <h2 className="font-bold text-lg truncate" title={course.title}>
          {course.title}
        </h2>
        {progress && (
          <div className="mt-3">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Progress</span>
              <span>{completedCount} / {totalCount}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Video List */}
      <nav className="flex-1 overflow-y-auto">
        {course.videos.map((video, index) => {
          const videoProgress = progress?.videosProgress[video.id];
          const isCompleted = videoProgress?.completed && videoProgress?.quizCompleted;
          const isCurrent = video.id === currentVideoId;

          return (
            <Link
              key={video.id}
              href={`/courses/${course.id}/video/${video.id}`}
              className={`
                block p-4 border-b border-gray-700 hover:bg-gray-700 transition
                ${isCurrent ? 'bg-gray-700 border-l-4 border-l-blue-500' : ''}
              `}
            >
              <div className="flex items-start gap-3">
                <span className="text-gray-400 text-sm mt-1 flex-shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate" title={video.title}>
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">
                      {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                    </span>
                    {isCompleted && (
                      <span className="text-xs text-green-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Completed
                      </span>
                    )}
                    {videoProgress?.completed && !videoProgress?.quizCompleted && (
                      <span className="text-xs text-yellow-400">
                        Quiz pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
        <p>Course by {course.instructor}</p>
        <p className="mt-1">{course.duration} total</p>
      </div>
    </aside>
  );
}
