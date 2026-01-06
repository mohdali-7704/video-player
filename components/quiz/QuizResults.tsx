'use client';

import { QuizResult } from '@/lib/types/quiz';

interface QuizResultsProps {
  result: QuizResult;
  onProceedToNext: () => void;
}

export default function QuizResults({ result, onProceedToNext }: QuizResultsProps) {
  const getScoreColor = () => {
    if (result.score >= 80) return 'text-green-600';
    if (result.score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    if (result.score >= 80) return 'Excellent work!';
    if (result.score >= 60) return 'Good effort!';
    return 'Keep practicing!';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
        <p className="text-gray-600">{getScoreMessage()}</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600 mb-1">Score</p>
            <p className={`text-3xl font-bold ${getScoreColor()}`}>
              {Math.round(result.score)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Correct</p>
            <p className="text-3xl font-bold text-gray-900">
              {result.correctAnswers}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-3xl font-bold text-gray-900">
              {result.totalQuestions}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answers:</h3>
        <div className="space-y-3">
          {result.answers.map((answer, index) => (
            <div
              key={answer.questionId}
              className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                answer.isCorrect
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
              }`}
            >
              <span className="font-medium">Question {index + 1}</span>
              <span className={`font-semibold ${
                answer.isCorrect ? 'text-green-600' : 'text-red-600'
              }`}>
                {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onProceedToNext}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Proceed to Next Video
        </button>
        <p className="text-sm text-gray-500 mt-3">
          You can proceed regardless of your score
        </p>
      </div>
    </div>
  );
}
