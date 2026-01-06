'use client';

import { useState } from 'react';
import { Quiz as QuizType, QuizAnswer, QuizResult } from '@/lib/types/quiz';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';

interface QuizProps {
  quiz: QuizType;
  onComplete: (result: QuizResult) => void;
  onProceedToNext: () => void;
}

export default function Quiz({ quiz, onComplete, onProceedToNext }: QuizProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<QuizResult | null>(null);

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const allQuestionsAnswered = () => {
    return quiz.questions.every(q => answers[q.id] !== undefined);
  };

  const handleSubmit = () => {
    const quizAnswers: QuizAnswer[] = quiz.questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: answers[q.id] ?? -1,
      isCorrect: answers[q.id] === q.correctAnswer
    }));

    const correctCount = quizAnswers.filter(a => a.isCorrect).length;
    const score = (correctCount / quiz.questions.length) * 100;

    const result: QuizResult = {
      quizId: quiz.id,
      answers: quizAnswers,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers: correctCount,
      completedAt: new Date().toISOString()
    };

    setResults(result);
    setShowResults(true);
    onComplete(result);
  };

  if (showResults && results) {
    return <QuizResults result={results} onProceedToNext={onProceedToNext} />;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
        <p className="text-gray-600">
          Answer all questions to complete this section
        </p>
      </div>

      {!showResults && (
        <>
          {quiz.questions.map((question, index) => (
            <QuizQuestion
              key={question.id}
              question={question}
              questionNumber={index + 1}
              selectedAnswer={answers[question.id]}
              showResult={false}
              onAnswerSelect={handleAnswerSelect}
              disabled={false}
            />
          ))}

          <div className="sticky bottom-0 bg-white border-t border-gray-200 py-4 px-6 shadow-lg">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {Object.keys(answers).length} of {quiz.questions.length} questions answered
              </div>
              <button
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered()}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  allQuestionsAnswered()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
