'use client';

import { useState } from 'react';
import { EnhancedCourse, Section, Lecture } from '@/lib/types/course';

interface CurriculumBuilderProps {
  courseData: Partial<EnhancedCourse>;
  updateCourseData: (updates: Partial<EnhancedCourse>) => void;
}

export default function CurriculumBuilder({ courseData, updateCourseData }: CurriculumBuilderProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const sections = courseData.sections || [];

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: `Section ${sections.length + 1}`,
      order: sections.length,
      lectures: [],
    };
    updateCourseData({ sections: [...sections, newSection] });
    setExpandedSections(new Set([...expandedSections, newSection.id]));
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    const updatedSections = sections.map((section) =>
      section.id === sectionId ? { ...section, ...updates } : section
    );
    updateCourseData({ sections: updatedSections });
  };

  const deleteSection = (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;
    updateCourseData({ sections: sections.filter((s) => s.id !== sectionId) });
  };

  const addLecture = (sectionId: string, type: 'video' | 'article' | 'quiz' | 'resource') => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    const newLecture: Lecture = {
      id: `lecture-${Date.now()}`,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      description: '',
      order: section.lectures.length,
      type,
      duration: 0,
      canPreview: false,
      content:
        type === 'video'
          ? { type: 'video', videoUrl: '' }
          : type === 'article'
          ? { type: 'article', content: '' }
          : type === 'quiz'
          ? { type: 'quiz', quiz: { id: `quiz-${Date.now()}`, title: 'New Quiz', questions: [] } }
          : { type: 'resource', description: '' },
    };

    const updatedSections = sections.map((s) =>
      s.id === sectionId ? { ...s, lectures: [...s.lectures, newLecture] } : s
    );
    updateCourseData({ sections: updatedSections });
  };

  const updateLecture = (sectionId: string, lectureId: string, updates: Partial<Lecture>) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          lectures: section.lectures.map((lecture) =>
            lecture.id === lectureId ? { ...lecture, ...updates } : lecture
          ),
        };
      }
      return section;
    });
    updateCourseData({ sections: updatedSections });
  };

  const deleteLecture = (sectionId: string, lectureId: string) => {
    if (!confirm('Are you sure you want to delete this lecture?')) return;
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          lectures: section.lectures.filter((l) => l.id !== lectureId),
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Curriculum</h2>
        <p className="text-gray-600">Build your course structure with sections and lectures</p>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Section Header */}
            <div className="bg-gray-100 p-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {expandedSections.has(section.id) ? '▼' : '▶'}
                </button>
                <div className="flex-1">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSection(section.id, { title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                    placeholder="Section title"
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {section.lectures.length} lecture{section.lectures.length !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={() => deleteSection(section.id)}
                  className="text-red-600 hover:text-red-700 font-medium px-3 py-2"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Section Content (Lectures) */}
            {expandedSections.has(section.id) && (
              <div className="p-4 space-y-3 bg-white">
                {/* Lectures List */}
                {section.lectures.map((lecture) => (
                  <div key={lecture.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getLectureIcon(lecture.type)}</span>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={lecture.title}
                          onChange={(e) =>
                            updateLecture(section.id, lecture.id, { title: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium mb-2"
                          placeholder="Lecture title"
                        />

                        {/* Lecture Type Specific Input */}
                        {lecture.type === 'video' && (
                          <div className="space-y-2">
                            <input
                              type="url"
                              value={(lecture.content as any).videoUrl || ''}
                              onChange={(e) =>
                                updateLecture(section.id, lecture.id, {
                                  content: { type: 'video', videoUrl: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              placeholder="Paste video URL (YouTube, Vimeo, or direct link)"
                            />
                            <div className="flex items-center gap-2">
                              <div className="flex-1 border-t border-gray-300"></div>
                              <span className="text-xs text-gray-500">OR</span>
                              <div className="flex-1 border-t border-gray-300"></div>
                            </div>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const formData = new FormData();
                                  formData.append('file', file);
                                  formData.append('type', 'video');
                                  try {
                                    const response = await fetch('/api/upload', {
                                      method: 'POST',
                                      body: formData,
                                    });
                                    const data = await response.json();
                                    if (data.success) {
                                      updateLecture(section.id, lecture.id, {
                                        content: { type: 'video', videoUrl: data.fileUrl },
                                      });
                                      alert(`Video uploaded: ${file.name}`);
                                    }
                                  } catch (error) {
                                    console.error('Upload error:', error);
                                    alert('Failed to upload video');
                                  }
                                }
                              }}
                              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                            />
                            <p className="text-xs text-gray-500">Upload MP4, MOV, AVI, or other video formats</p>
                          </div>
                        )}

                        {lecture.type === 'article' && (
                          <textarea
                            value={(lecture.content as any).content || ''}
                            onChange={(e) =>
                              updateLecture(section.id, lecture.id, {
                                content: { type: 'article', content: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Article content (supports markdown)"
                            rows={4}
                          />
                        )}

                        {lecture.type === 'resource' && (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={(lecture.content as any).description || ''}
                              onChange={(e) =>
                                updateLecture(section.id, lecture.id, {
                                  content: { type: 'resource', description: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              placeholder="Resource description"
                            />
                            <div className="text-xs text-gray-600 font-medium mb-1">Attach Files:</div>
                            <input
                              type="file"
                              accept=".pdf,.ppt,.pptx,.doc,.docx,.zip"
                              multiple
                              onChange={async (e) => {
                                const files = Array.from(e.target.files || []);
                                if (files.length > 0) {
                                  for (const file of files) {
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    formData.append('type', 'resource');
                                    try {
                                      const response = await fetch('/api/upload', {
                                        method: 'POST',
                                        body: formData,
                                      });
                                      const data = await response.json();
                                      if (data.success) {
                                        console.log('Uploaded resource:', data.fileUrl);
                                        alert(`File uploaded: ${file.name}`);
                                      }
                                    } catch (error) {
                                      console.error('Upload error:', error);
                                      alert(`Failed to upload ${file.name}`);
                                    }
                                  }
                                }
                              }}
                              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 cursor-pointer"
                            />
                            <p className="text-xs text-gray-500">Upload PDFs, PPTs, DOCs, or ZIP files</p>
                          </div>
                        )}

                        {lecture.type === 'quiz' && (
                          <div className="space-y-3 bg-purple-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-purple-900">Quiz Questions</h4>
                              <button
                                onClick={() => {
                                  const currentQuiz = (lecture.content as any).quiz;
                                  const newQuestion = {
                                    id: `question-${Date.now()}`,
                                    question: '',
                                    options: ['', '', '', ''],
                                    correctAnswer: 0,
                                    explanation: '',
                                  };
                                  updateLecture(section.id, lecture.id, {
                                    content: {
                                      type: 'quiz',
                                      quiz: {
                                        ...currentQuiz,
                                        questions: [...currentQuiz.questions, newQuestion],
                                      },
                                    },
                                  });
                                }}
                                className="px-3 py-1 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-700"
                              >
                                + Add Question
                              </button>
                            </div>

                            {/* Quiz Title */}
                            <input
                              type="text"
                              value={(lecture.content as any).quiz.title || ''}
                              onChange={(e) => {
                                const currentQuiz = (lecture.content as any).quiz;
                                updateLecture(section.id, lecture.id, {
                                  content: {
                                    type: 'quiz',
                                    quiz: { ...currentQuiz, title: e.target.value },
                                  },
                                });
                              }}
                              className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                              placeholder="Quiz title"
                            />

                            {/* Questions List */}
                            <div className="space-y-4">
                              {((lecture.content as any).quiz.questions || []).map(
                                (question: any, qIndex: number) => (
                                  <div
                                    key={question.id}
                                    className="bg-white border-2 border-purple-200 rounded-lg p-4 space-y-3"
                                  >
                                    {/* Delete Button */}
                                    <div className="flex justify-end">
                                      <button
                                        onClick={() => {
                                          const currentQuiz = (lecture.content as any).quiz;
                                          const updatedQuestions = currentQuiz.questions.filter(
                                            (_: any, i: number) => i !== qIndex
                                          );
                                          updateLecture(section.id, lecture.id, {
                                            content: {
                                              type: 'quiz',
                                              quiz: { ...currentQuiz, questions: updatedQuestions },
                                            },
                                          });
                                        }}
                                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                                      >
                                        Delete
                                      </button>
                                    </div>

                                    {/* Question Text */}
                                    <textarea
                                      value={question.question}
                                      onChange={(e) => {
                                        const currentQuiz = (lecture.content as any).quiz;
                                        const updatedQuestions = currentQuiz.questions.map(
                                          (q: any, i: number) =>
                                            i === qIndex ? { ...q, question: e.target.value } : q
                                        );
                                        updateLecture(section.id, lecture.id, {
                                          content: {
                                            type: 'quiz',
                                            quiz: { ...currentQuiz, questions: updatedQuestions },
                                          },
                                        });
                                      }}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                      placeholder="Enter your question"
                                      rows={2}
                                    />

                                    {/* Options */}
                                    <div className="space-y-2">
                                      <label className="text-xs font-medium text-gray-700">
                                        Answer Options (select the correct one):
                                      </label>
                                      {question.options.map((option: string, oIndex: number) => (
                                        <div key={oIndex} className="flex items-center gap-2">
                                          <input
                                            type="radio"
                                            name={`question-${question.id}`}
                                            checked={question.correctAnswer === oIndex}
                                            onChange={() => {
                                              const currentQuiz = (lecture.content as any).quiz;
                                              const updatedQuestions = currentQuiz.questions.map(
                                                (q: any, i: number) =>
                                                  i === qIndex ? { ...q, correctAnswer: oIndex } : q
                                              );
                                              updateLecture(section.id, lecture.id, {
                                                content: {
                                                  type: 'quiz',
                                                  quiz: { ...currentQuiz, questions: updatedQuestions },
                                                },
                                              });
                                            }}
                                            className="w-4 h-4 text-purple-600"
                                          />
                                          <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => {
                                              const currentQuiz = (lecture.content as any).quiz;
                                              const updatedQuestions = currentQuiz.questions.map(
                                                (q: any, i: number) => {
                                                  if (i === qIndex) {
                                                    const newOptions = [...q.options];
                                                    newOptions[oIndex] = e.target.value;
                                                    return { ...q, options: newOptions };
                                                  }
                                                  return q;
                                                }
                                              );
                                              updateLecture(section.id, lecture.id, {
                                                content: {
                                                  type: 'quiz',
                                                  quiz: { ...currentQuiz, questions: updatedQuestions },
                                                },
                                              });
                                            }}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                            placeholder={`Option ${oIndex + 1}`}
                                          />
                                        </div>
                                      ))}
                                    </div>

                                    {/* Explanation */}
                                    <textarea
                                      value={question.explanation}
                                      onChange={(e) => {
                                        const currentQuiz = (lecture.content as any).quiz;
                                        const updatedQuestions = currentQuiz.questions.map(
                                          (q: any, i: number) =>
                                            i === qIndex ? { ...q, explanation: e.target.value } : q
                                        );
                                        updateLecture(section.id, lecture.id, {
                                          content: {
                                            type: 'quiz',
                                            quiz: { ...currentQuiz, questions: updatedQuestions },
                                          },
                                        });
                                      }}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                      placeholder="Explanation (why this is the correct answer)"
                                      rows={2}
                                    />
                                  </div>
                                )
                              )}

                              {((lecture.content as any).quiz.questions || []).length === 0 && (
                                <div className="text-center py-6 text-gray-500 text-sm">
                                  No questions yet. Click "Add Question" to create your first question.
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Duration Input */}
                        <div className="flex items-center gap-4 mt-2">
                          <label className="flex items-center gap-2 text-sm">
                            <span className="text-gray-700">Duration (minutes):</span>
                            <input
                              type="number"
                              value={Math.floor(lecture.duration / 60)}
                              onChange={(e) =>
                                updateLecture(section.id, lecture.id, {
                                  duration: parseInt(e.target.value) * 60,
                                })
                              }
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                              min="0"
                            />
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={lecture.canPreview}
                              onChange={(e) =>
                                updateLecture(section.id, lecture.id, {
                                  canPreview: e.target.checked,
                                })
                              }
                              className="rounded"
                            />
                            <span className="text-gray-700">Free preview</span>
                          </label>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteLecture(section.id, lecture.id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add Lecture Buttons */}
                <div className="flex gap-2 flex-wrap pt-2">
                  <button
                    onClick={() => addLecture(section.id, 'video')}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-medium flex items-center gap-2"
                  >
                    <span>🎥</span> Add Video
                  </button>
                  <button
                    onClick={() => addLecture(section.id, 'article')}
                    className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-sm font-medium flex items-center gap-2"
                  >
                    <span>📄</span> Add Article
                  </button>
                  <button
                    onClick={() => addLecture(section.id, 'quiz')}
                    className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition text-sm font-medium flex items-center gap-2"
                  >
                    <span>❓</span> Add Quiz
                  </button>
                  <button
                    onClick={() => addLecture(section.id, 'resource')}
                    className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition text-sm font-medium flex items-center gap-2"
                  >
                    <span>📎</span> Add Resource
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add Section Button */}
        <button
          onClick={addSection}
          className="w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-gray-600 hover:text-blue-700 font-medium"
        >
          + Add New Section
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <span className="text-2xl mr-3">💡</span>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Curriculum Structure Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Organize content into logical sections (e.g., Introduction, Advanced Topics)</li>
              <li>• Mix different content types to keep students engaged</li>
              <li>• Start with easier concepts and progress to more complex topics</li>
              <li>• Mark 1-2 lectures as "Free preview" to attract students</li>
            </ul>
          </div>
        </div>
      </div>

      {sections.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <span className="text-6xl mb-4 block">📚</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No sections yet</h3>
          <p className="text-gray-600 mb-4">Start building your curriculum by adding your first section</p>
        </div>
      )}
    </div>
  );
}
