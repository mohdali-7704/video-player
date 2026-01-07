'use client';

import { useState } from 'react';
import { EnhancedCourse } from '@/lib/types/course';

interface CourseDetailsFormProps {
  courseData: Partial<EnhancedCourse>;
  updateCourseData: (updates: Partial<EnhancedCourse>) => void;
}

export default function CourseDetailsForm({ courseData, updateCourseData }: CourseDetailsFormProps) {
  const [newLearningItem, setNewLearningItem] = useState('');
  const [newRequirement, setNewRequirement] = useState('');

  const addLearningItem = () => {
    if (newLearningItem.trim()) {
      const currentItems = courseData.whatYouWillLearn || [];
      updateCourseData({ whatYouWillLearn: [...currentItems, newLearningItem.trim()] });
      setNewLearningItem('');
    }
  };

  const removeLearningItem = (index: number) => {
    const currentItems = courseData.whatYouWillLearn || [];
    updateCourseData({ whatYouWillLearn: currentItems.filter((_, i) => i !== index) });
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      const currentReqs = courseData.requirements || [];
      updateCourseData({ requirements: [...currentReqs, newRequirement.trim()] });
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    const currentReqs = courseData.requirements || [];
    updateCourseData({ requirements: currentReqs.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Details</h2>
        <p className="text-gray-600">Provide detailed information about your course content</p>
      </div>

      {/* Course Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={courseData.description || ''}
          onChange={(e) => updateCourseData({ description: e.target.value })}
          placeholder="Write a comprehensive description of your course. What will students learn? What makes this course unique?"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px]"
          rows={6}
        />
        <p className="text-sm text-gray-500 mt-1">
          {courseData.description?.length || 0} characters (minimum 200 recommended)
        </p>
      </div>

      {/* What You'll Learn */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What Students Will Learn <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Add at least 4 learning outcomes or objectives (what skills will students gain?)
        </p>

        {/* List of Learning Items */}
        <div className="space-y-2 mb-3">
          {(courseData.whatYouWillLearn || []).map((item, index) => (
            <div key={index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
              <span className="text-green-600 mt-1">✓</span>
              <p className="flex-1 text-gray-900">{item}</p>
              <button
                onClick={() => removeLearningItem(index)}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Add New Item */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newLearningItem}
            onChange={(e) => setNewLearningItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addLearningItem()}
            placeholder="e.g., Build professional web applications with React"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={addLearningItem}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Add
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {(courseData.whatYouWillLearn || []).length} items added (minimum 4 required)
        </p>
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Requirements
        </label>
        <p className="text-sm text-gray-600 mb-3">
          What should students know or have before taking this course? (Optional)
        </p>

        {/* List of Requirements */}
        <div className="space-y-2 mb-3">
          {(courseData.requirements || []).map((item, index) => (
            <div key={index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
              <span className="text-blue-600 mt-1">•</span>
              <p className="flex-1 text-gray-900">{item}</p>
              <button
                onClick={() => removeRequirement(index)}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Add New Requirement */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
            placeholder="e.g., Basic knowledge of HTML and CSS"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={addRequirement}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Add
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">{(courseData.requirements || []).length} items added</p>
      </div>

      {/* Info Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <span className="text-2xl mr-3">💡</span>
          <div>
            <h4 className="font-semibold text-yellow-900 mb-1">Writing Great Learning Outcomes</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Start with action verbs (Build, Create, Master, Understand)</li>
              <li>• Be specific and measurable</li>
              <li>• Focus on practical skills students will gain</li>
              <li>• Highlight what makes your course valuable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
