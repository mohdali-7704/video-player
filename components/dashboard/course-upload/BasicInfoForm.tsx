'use client';

import { EnhancedCourse } from '@/lib/types/course';

interface BasicInfoFormProps {
  courseData: Partial<EnhancedCourse>;
  updateCourseData: (updates: Partial<EnhancedCourse>) => void;
}

const CATEGORIES = [
  'Development',
  'Business',
  'Design',
  'Marketing',
  'IT & Software',
  'Personal Development',
  'Photography',
  'Music',
  'Health & Fitness',
  'Teaching & Academics',
];

export default function BasicInfoForm({ courseData, updateCourseData }: BasicInfoFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600">Let's start with the essential details about your course</p>
      </div>

      {/* Course Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={courseData.title || ''}
          onChange={(e) => updateCourseData({ title: e.target.value })}
          placeholder="e.g., Complete Web Development Bootcamp"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={100}
        />
        <p className="text-sm text-gray-500 mt-1">{courseData.title?.length || 0}/100 characters</p>
      </div>

      {/* Course Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Subtitle
        </label>
        <input
          type="text"
          value={courseData.subtitle || ''}
          onChange={(e) => updateCourseData({ subtitle: e.target.value })}
          placeholder="e.g., Learn HTML, CSS, JavaScript, React, Node.js and more"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={120}
        />
        <p className="text-sm text-gray-500 mt-1">{courseData.subtitle?.length || 0}/120 characters</p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          value={courseData.category || ''}
          onChange={(e) => updateCourseData({ category: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Instructor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Instructor Name
        </label>
        <input
          type="text"
          value={courseData.instructor || 'Admin'}
          onChange={(e) => updateCourseData({ instructor: e.target.value })}
          placeholder="e.g., John Doe"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <span className="text-2xl mr-3">💡</span>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Course Title Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Keep it clear and descriptive</li>
              <li>• Include key topics or technologies</li>
              <li>• Avoid special characters or all caps</li>
              <li>• Make it searchable and appealing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
