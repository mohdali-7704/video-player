'use client';

import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Course } from '@/lib/types/course';
import { CourseProgress } from '@/lib/types/progress';

interface CertificateProps {
  course: Course;
  progress: CourseProgress;
  studentName: string;
}

export default function Certificate({ course, progress, studentName }: CertificateProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const completionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const certificateId = `CERT-${course.id.toUpperCase()}-${Date.now()}`;

  const handleDownload = async () => {
    const certificateElement = document.getElementById('certificate');
    if (!certificateElement) return;

    setIsGeneratingPdf(true);

    try {
      // Convert HTML to canvas
      const canvas = await html2canvas(certificateElement, {
        scale: 2 as any, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      } as any);

      // Get canvas dimensions
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Generate filename with course name and date
      const filename = `Certificate-${course.title.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;

      // Download the PDF
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate certificate. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Course Completed!
        </h2>
        <p className="text-gray-600">
          Congratulations on completing the course. Download your certificate below.
        </p>
      </div>

      {/* Certificate Preview */}
      <div
        id="certificate"
        className="border-8 border-double p-12 relative overflow-hidden"
        style={{
          aspectRatio: '1.414/1',
          backgroundColor: '#eff6ff',
          borderColor: '#1e3a8a'
        }}
      >
        {/* Decorative Corner Elements */}
        <div className="absolute top-4 left-4 w-16 h-16 opacity-50" style={{ borderTop: '4px solid #93c5fd', borderLeft: '4px solid #93c5fd' }}></div>
        <div className="absolute top-4 right-4 w-16 h-16 opacity-50" style={{ borderTop: '4px solid #93c5fd', borderRight: '4px solid #93c5fd' }}></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 opacity-50" style={{ borderBottom: '4px solid #93c5fd', borderLeft: '4px solid #93c5fd' }}></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 opacity-50" style={{ borderBottom: '4px solid #93c5fd', borderRight: '4px solid #93c5fd' }}></div>

        <div className="relative z-10 text-center space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-5xl font-serif font-bold mb-2" style={{ color: '#1e3a8a' }}>
              Certificate of Completion
            </h1>
            <div className="w-24 h-1 mx-auto" style={{ backgroundColor: '#2563eb' }}></div>
          </div>

          {/* Body */}
          <div className="space-y-4 py-6">
            <p className="text-lg" style={{ color: '#374151' }}>This is to certify that</p>
            <p className="text-4xl font-bold font-serif" style={{ color: '#111827' }}>
              {studentName}
            </p>
            <p className="text-lg" style={{ color: '#374151' }}>has successfully completed the course</p>
            <p className="text-3xl font-semibold px-8" style={{ color: '#1e40af' }}>
              {course.title}
            </p>
            <p style={{ color: '#4b5563' }}>
              Instructed by <span className="font-semibold">{course.instructor}</span>
            </p>
          </div>

          {/* Course Details */}
          <div className="flex justify-center gap-8 py-4 text-sm" style={{ color: '#4b5563' }}>
            <div>
              <p className="font-semibold" style={{ color: '#111827' }}>Videos Completed</p>
              <p>{progress.completedVideos} / {progress.totalVideos}</p>
            </div>
            <div>
              <p className="font-semibold" style={{ color: '#111827' }}>Course Level</p>
              <p>{course.level}</p>
            </div>
            <div>
              <p className="font-semibold" style={{ color: '#111827' }}>Duration</p>
              <p>{course.duration}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 space-y-2">
            <p style={{ color: '#374151' }}>
              Date of Completion: <span className="font-semibold">{completionDate}</span>
            </p>
            <p className="text-xs font-mono" style={{ color: '#6b7280' }}>
              Certificate ID: {certificateId}
            </p>
          </div>

          {/* Signature Line */}
          <div className="pt-8">
            <div className="w-64 mx-auto">
              <div className="pt-2" style={{ borderTop: '2px solid #9ca3af' }}>
                <p className="text-sm font-semibold" style={{ color: '#111827' }}>{course.instructor}</p>
                <p className="text-xs" style={{ color: '#4b5563' }}>Course Instructor</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleDownload}
          disabled={isGeneratingPdf}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
        </button>
        <p className="text-sm text-gray-500 mt-2">
          Click to download certificate as PDF
        </p>
      </div>

    </div>
  );
}
