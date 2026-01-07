'use client';

import { EnhancedCourse } from '@/lib/types/course';

interface PublishSettingsFormProps {
  courseData: Partial<EnhancedCourse>;
  updateCourseData: (updates: Partial<EnhancedCourse>) => void;
}

export default function PublishSettingsForm({ courseData, updateCourseData }: PublishSettingsFormProps) {
  const sections = courseData.sections || [];

  // Get all lectures with their section info for preview selection
  const allLectures = sections.flatMap((section) =>
    section.lectures.map((lecture) => ({
      lecture,
      sectionTitle: section.title,
      sectionId: section.id,
    }))
  );

  const toggleLecturePreview = (sectionId: string, lectureId: string) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          lectures: section.lectures.map((lecture) =>
            lecture.id === lectureId
              ? { ...lecture, canPreview: !lecture.canPreview }
              : lecture
          ),
        };
      }
      return section;
    });
    updateCourseData({ sections: updatedSections });
  };

  const getLectureIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'article':
        return '📄';
      case 'quiz':
        return '❓';
      case 'resource':
        return '📎';
      default:
        return '📚';
    }
  };

  const previewCount = allLectures.filter((item) => item.lecture.canPreview).length;
  const totalLectures = allLectures.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Publish Settings</h2>
        <p className="text-gray-600">Configure your course settings before publishing</p>
      </div>

      {/* Course Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Title</p>
            <p className="font-medium text-gray-900">{courseData.title || 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Category</p>
            <p className="font-medium text-gray-900">{courseData.category || 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Sections</p>
            <p className="font-medium text-gray-900">{sections.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Lectures</p>
            <p className="font-medium text-gray-900">{totalLectures}</p>
          </div>
        </div>
      </div>

      {/* Preview Lectures Selection */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Preview Lectures</h3>
          <p className="text-sm text-gray-600">
            Select lectures that students can preview for free before enrolling. Recommended: 1-2 lectures
          </p>
          <p className="text-sm font-medium text-blue-600 mt-1">
            {previewCount} of {totalLectures} lectures selected for preview
          </p>
        </div>

        {totalLectures === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <span className="text-4xl mb-2 block">📚</span>
            <p className="text-gray-600">No lectures added yet. Add lectures in the Curriculum step.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
            {allLectures.map((item) => (
              <label
                key={`${item.sectionId}-${item.lecture.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-200"
              >
                <input
                  type="checkbox"
                  checked={item.lecture.canPreview}
                  onChange={() => toggleLecturePreview(item.sectionId, item.lecture.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xl">{getLectureIcon(item.lecture.type)}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.lecture.title}</p>
                  <p className="text-sm text-gray-600">
                    {item.sectionTitle} • {item.lecture.type}
                    {item.lecture.duration > 0 &&
                      ` • ${Math.floor(item.lecture.duration / 60)} min`}
                  </p>
                </div>
                {item.lecture.canPreview && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                    FREE
                  </span>
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Publish Toggle */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Publish Course</h3>
            <p className="text-sm text-gray-600 mb-4">
              When you publish your course, it will be visible to students. You can always unpublish it later.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={courseData.published || false}
              onChange={(e) => updateCourseData({ published: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900">
              {courseData.published ? 'Published' : 'Draft'}
            </span>
          </label>
        </div>
      </div>

      {/* Completion Checklist */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>✓</span> Pre-Publish Checklist
        </h3>
        <div className="space-y-2">
          <ChecklistItem
            checked={!!courseData.title}
            text="Course title added"
          />
          <ChecklistItem
            checked={!!courseData.category}
            text="Category selected"
          />
          <ChecklistItem
            checked={!!courseData.thumbnail}
            text="Course thumbnail uploaded"
          />
          <ChecklistItem
            checked={sections.length > 0}
            text="At least 1 section added"
          />
          <ChecklistItem
            checked={totalLectures > 0}
            text="At least 1 lecture added"
          />
        </div>
      </div>

      {/* Final Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <span className="text-2xl mr-3">🚀</span>
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Ready to Publish?</h4>
            <p className="text-sm text-green-800">
              Once you publish, your course will be available to students. You can always edit and
              update your course later. Click "Publish Course" below to make it live!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistItem({ checked, text }: { checked: boolean; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
          checked ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
        }`}
      >
        {checked ? '✓' : '○'}
      </div>
      <span className={`text-sm ${checked ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
        {text}
      </span>
    </div>
  );
}
