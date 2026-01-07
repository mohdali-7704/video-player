'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BasicInfoForm from '@/components/dashboard/course-upload/BasicInfoForm';
import MediaUploadForm from '@/components/dashboard/course-upload/MediaUploadForm';
import CurriculumBuilder from '@/components/dashboard/course-upload/CurriculumBuilder';
import PublishSettingsForm from '@/components/dashboard/course-upload/PublishSettingsForm';
import { EnhancedCourse, Section } from '@/lib/types/course';

const STEPS = [
  { id: 1, title: 'Basic Info', icon: '📝' },
  { id: 2, title: 'Media', icon: '🎬' },
  { id: 3, title: 'Curriculum', icon: '📚' },
  { id: 4, title: 'Publish', icon: '🚀' },
];

export default function CourseUploadPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [courseData, setCourseData] = useState<Partial<EnhancedCourse>>({
    title: '',
    subtitle: '',
    description: '',
    instructor: 'Admin',
    thumbnail: '',
    category: '',
    level: 'Beginner',
    language: 'English',
    whatYouWillLearn: [],
    requirements: [],
    published: false,
    sections: [],
  });

  const updateCourseData = (updates: Partial<EnhancedCourse>) => {
    setCourseData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...courseData,
          published: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        alert('Draft saved successfully!');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...courseData,
          published: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Course published successfully!');
        router.push('/dashboard/courses');
      }
    } catch (error) {
      console.error('Error publishing course:', error);
      alert('Failed to publish course');
    } finally {
      setSaving(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return courseData.title && courseData.category;
      case 2:
        return courseData.thumbnail;
      case 3:
        return courseData.sections && courseData.sections.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload New Course</h1>
          <p className="text-gray-600">Create and publish your course content</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-semibold transition-colors ${
                      currentStep === step.id
                        ? 'bg-blue-600 text-white'
                        : currentStep > step.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.id ? '✓' : step.icon}
                  </div>
                  <div className="mt-2 text-center">
                    <div
                      className={`text-sm font-medium ${
                        currentStep === step.id
                          ? 'text-blue-600'
                          : currentStep > step.id
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </div>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-4 transition-colors ${
                      currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          {currentStep === 1 && (
            <BasicInfoForm courseData={courseData} updateCourseData={updateCourseData} />
          )}
          {currentStep === 2 && (
            <MediaUploadForm courseData={courseData} updateCourseData={updateCourseData} />
          )}
          {currentStep === 3 && (
            <CurriculumBuilder courseData={courseData} updateCourseData={updateCourseData} />
          )}
          {currentStep === 4 && (
            <PublishSettingsForm courseData={courseData} updateCourseData={updateCourseData} />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
          <div>
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
          </div>

          <div className="flex gap-4">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Previous
              </button>
            )}

            {currentStep < STEPS.length ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={saving || !isStepValid()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
              >
                {saving ? 'Publishing...' : 'Publish Course'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
