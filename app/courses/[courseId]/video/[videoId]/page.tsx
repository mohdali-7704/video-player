'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { CourseLoader } from '@/lib/utils/courseLoader';
import { Course, Video } from '@/lib/types/course';
import RestrictedVideoPlayer from '@/components/video/RestrictedVideoPlayer';
import Quiz from '@/components/quiz/Quiz';
import CourseSidebar from '@/components/course/CourseSidebar';
import { useProgressTracking } from '@/lib/hooks/useProgressTracking';

export default function VideoPage({
  params
}: {
  params: Promise<{ courseId: string; videoId: string }>
}) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courseId, setCourseId] = useState<string>('');
  const [videoId, setVideoId] = useState<string>('');

  const {
    courseProgress,
    updateVideoProgress,
    markVideoCompleted,
    markQuizCompleted,
    setTotalVideos
  } = useProgressTracking(courseId);

  useEffect(() => {
    const loadData = async () => {
      // Await params
      const resolvedParams = await params;
      setCourseId(resolvedParams.courseId);
      setVideoId(resolvedParams.videoId);

      const courseData = await CourseLoader.loadCourse(resolvedParams.courseId);
      if (!courseData) {
        notFound();
      }

      const videoData = CourseLoader.getVideo(courseData, resolvedParams.videoId);
      if (!videoData) {
        notFound();
      }

      setCourse(courseData);
      setVideo(videoData);
      setTotalVideos(courseData.videos.length);
      setLoading(false);
    };

    loadData();
  }, [params, setTotalVideos]);

  const handleVideoComplete = () => {
    markVideoCompleted(videoId);
    setShowQuiz(true);
  };

  const handleQuizComplete = (result: any) => {
    markQuizCompleted(videoId, result.score);
  };

  const handleProceedToNext = () => {
    if (!course) return;

    const nextVideo = CourseLoader.getNextVideo(course, videoId);
    if (nextVideo) {
      router.push(`/courses/${courseId}/video/${nextVideo.id}`);
      // Reset state for next video
      setShowQuiz(false);
    } else {
      // Last video, go back to course overview
      router.push(`/courses/${courseId}`);
    }
  };

  if (loading || !course || !video) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  const videoProgress = courseProgress?.videosProgress[videoId];

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <CourseSidebar
        course={course}
        currentVideoId={videoId}
        progress={courseProgress}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {!showQuiz ? (
          <div className="flex-1 flex flex-col">
            <RestrictedVideoPlayer
              videoUrl={video.videoUrl}
              videoId={video.id}
              courseId={courseId}
              initialProgress={videoProgress}
              onProgressUpdate={(progress) => updateVideoProgress(video.id, progress)}
              onVideoComplete={handleVideoComplete}
            />
            <div className="bg-white p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{video.title}</h1>
              <p className="text-gray-600">{video.description}</p>

              {/* Important Notes */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Certification Rules:
                </h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• You cannot skip forward in the video</li>
                  <li>• Switching tabs will restart the video</li>
                  <li>• You can pause and rewind at any time</li>
                  <li>• Complete the quiz after watching the video</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-gray-50 p-6 overflow-auto">
            <Quiz
              quiz={video.quiz}
              onComplete={handleQuizComplete}
              onProceedToNext={handleProceedToNext}
            />
          </div>
        )}
      </div>
    </div>
  );
}
