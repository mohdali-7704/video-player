export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
}

export interface QuizResult {
  quizId: string;
  answers: QuizAnswer[];
  score: number; // percentage
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string; // ISO date string
}
