'use client';

import { QuizQuestion as QuizQuestionType } from '@/lib/types/quiz';
import QuizOption from './QuizOption';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  selectedAnswer?: number;
  showResult: boolean;
  onAnswerSelect: (questionId: string, answerIndex: number) => void;
  disabled: boolean;
}

export default function QuizQuestion({
  question,
  questionNumber,
  selectedAnswer,
  showResult,
  onAnswerSelect,
  disabled
}: QuizQuestionProps) {
  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Question {questionNumber}: {question.question}
        </h3>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <QuizOption
            key={index}
            option={option}
            index={index}
            isSelected={selectedAnswer === index}
            isCorrect={index === question.correctAnswer}
            showResult={showResult}
            onSelect={(idx) => onAnswerSelect(question.id, idx)}
            disabled={disabled}
          />
        ))}
      </div>

      {showResult && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-900">Explanation:</p>
          <p className="text-sm text-blue-800 mt-1">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
