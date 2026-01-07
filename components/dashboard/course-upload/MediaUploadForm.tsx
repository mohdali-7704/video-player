'use client';

import { useState } from 'react';
import { EnhancedCourse } from '@/lib/types/course';

interface MediaUploadFormProps {
  courseData: Partial<EnhancedCourse>;
  updateCourseData: (updates: Partial<EnhancedCourse>) => void;
}

export default function MediaUploadForm({ courseData, updateCourseData }: MediaUploadFormProps) {
  const [uploading, setUploading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(courseData.thumbnail || '');

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'thumbnail');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        updateCourseData({ thumbnail: data.fileUrl });
        setThumbnailPreview(URL.createObjectURL(file));
      }
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      alert('Failed to upload thumbnail');
    } finally {
      setUploading(false);
    }
  };

  const handleThumbnailUrlChange = (url: string) => {
    updateCourseData({ thumbnail: url });
    setThumbnailPreview(url);
  };

  const removeThumbnail = () => {
    updateCourseData({ thumbnail: '' });
    setThumbnailPreview('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Media</h2>
        <p className="text-gray-600">Upload or link to your course promotional materials</p>
      </div>

      {/* Course Thumbnail */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Thumbnail <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Upload an image or provide a URL. Recommended size: 1280x720 (16:9 aspect ratio)
        </p>

        {/* Thumbnail Preview */}
        {thumbnailPreview && (
          <div className="mb-4 relative">
            <img
              src={thumbnailPreview}
              alt="Course thumbnail"
              className="w-full max-w-2xl h-auto rounded-lg border-2 border-gray-300"
            />
            <button
              onClick={removeThumbnail}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition text-sm font-medium"
            >
              Remove
            </button>
          </div>
        )}

        {/* Upload or URL Input */}
        {!thumbnailPreview && (
          <div className="space-y-4">
            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
              <input
                type="file"
                id="thumbnail-upload"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
                disabled={uploading}
              />
              <label
                htmlFor="thumbnail-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <span className="text-5xl mb-4">🖼️</span>
                <span className="text-lg font-medium text-gray-900 mb-2">
                  {uploading ? 'Uploading...' : 'Click to upload thumbnail'}
                </span>
                <span className="text-sm text-gray-600">PNG, JPG or WEBP (Max 5MB)</span>
              </label>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Image URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                onChange={(e) => handleThumbnailUrlChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <span className="text-2xl mr-3">💡</span>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Thumbnail Best Practices</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use high-quality images with 1280x720 resolution</li>
              <li>• Include clear, readable text overlay</li>
              <li>• Show relevant course content or technology</li>
              <li>• Use contrasting colors to stand out</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
