'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CourseLoader } from '@/lib/utils/courseLoader';
import { Course } from '@/lib/types/course';
import { ProgressManager } from '@/lib/utils/progressManager';
import { CourseProgress } from '@/lib/types/progress';
import Certificate from '@/components/certificate/Certificate';

export default function CoursePage({
  params
}: {
  params: Promise<{ courseId: string }>
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [courseId, setCourseId] = useState<string>('');
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      setCourseId(resolvedParams.courseId);

      const courseData = await CourseLoader.loadCourse(resolvedParams.courseId);
      if (!courseData) {
        notFound();
      }

      setCourse(courseData);

      // Load progress
      const courseProgress = ProgressManager.getCourseProgress(resolvedParams.courseId);
      setProgress(courseProgress);

      // Check if course is completed and mark it if not already marked
      if (ProgressManager.isCourseCompleted(resolvedParams.courseId)) {
        if (!courseProgress?.courseCompleted) {
          // Course is completed but not marked - mark it now
          ProgressManager.markCourseCompleted(resolvedParams.courseId);
          // Reload progress to get updated values
          const updatedProgress = ProgressManager.getCourseProgress(resolvedParams.courseId);
          setProgress(updatedProgress);
        }
      }

      // Load saved student name if exists
      if (courseProgress?.studentName) {
        setStudentName(courseProgress.studentName);
      }

      // Check if certificate was already generated and name exists
      if (courseProgress?.certificateGenerated && courseProgress?.studentName) {
        setShowCertificate(true);
      }

      setLoading(false);
    };

    loadData();
  }, [params]);

  const handleGenerateCertificate = () => {
    if (studentName.trim()) {
      // Save the student name to localStorage
      ProgressManager.saveStudentName(courseId, studentName.trim());

      // Update local state to reflect saved name
      const updatedProgress = ProgressManager.getCourseProgress(courseId);
      setProgress(updatedProgress);

      setShowCertificate(true);
    } else {
      alert('Please enter your name to generate the certificate.');
    }
  };

  if (loading || !course) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-gray-900 text-lg">Loading...</div>
      </div>
    );
  }

  // Check if course is completed (either by flag or by actual completion count)
  const isCourseCompleted =
    progress?.courseCompleted ||
    (progress && progress.completedVideos === progress.totalVideos && progress.totalVideos > 0) ||
    false;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
            ← Back to Courses
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Instructor: {course.instructor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Duration: {course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Level: {course.level}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {progress && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Course Progress</span>
                <span className="text-gray-600">
                  {progress.completedVideos} / {progress.totalVideos} videos completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${progress.totalVideos > 0 ? (progress.completedVideos / progress.totalVideos) * 100 : 0}%`
                  }}
                ></div>
              </div>
              {isCourseCompleted && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-800 font-medium">
                    Course Completed! Your certificate is ready below.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Course Content */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
            <p className="text-gray-600 mt-1">
              {course.videos.length} videos • Each video has a quiz
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {course.videos.map((video, index) => (
              <Link
                key={video.id}
                href={`/courses/${courseId}/video/${video.id}`}
                className="block p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 font-mono text-sm flex-shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{video.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {video.quiz.questions.length} quiz questions
                      </span>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Certificate Section */}
        {isCourseCompleted && (
          <div className="mt-6">
            {!showCertificate ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Get Your Certificate</h2>
                    <p className="text-gray-600">Enter your name to generate your completion certificate</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleGenerateCertificate();
                      }
                    }}
                  />
                  <button
                    onClick={handleGenerateCertificate}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Generate Certificate
                  </button>
                </div>
              </div>
            ) : (
              progress && <Certificate course={course} progress={progress} studentName={studentName} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
