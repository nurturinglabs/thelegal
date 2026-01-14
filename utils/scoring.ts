import { MARKS_PER_QUESTION, NEGATIVE_MARKS } from './constants';

export interface ScoringResult {
  score: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  accuracy: number;
  totalQuestions: number;
}

export function calculateScore(
  answers: Record<string, number>,
  correctAnswers: Record<string, number>,
  totalQuestions: number
): ScoringResult {
  let correct = 0;
  let incorrect = 0;

  Object.entries(answers).forEach(([questionId, userAnswer]) => {
    if (correctAnswers[questionId] === userAnswer) {
      correct++;
    } else if (userAnswer !== -1) {
      incorrect++;
    }
  });

  const unattempted = totalQuestions - correct - incorrect;
  const score = correct * MARKS_PER_QUESTION - incorrect * NEGATIVE_MARKS;
  const accuracy = totalQuestions > 0 ? (correct / totalQuestions) * 100 : 0;

  return {
    score: Math.max(0, score),
    correct,
    incorrect,
    unattempted,
    accuracy: Math.round(accuracy * 100) / 100,
    totalQuestions,
  };
}

export function calculatePercentage(score: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((score / total) * 100 * 100) / 100;
}

export function getPerformanceLevel(percentage: number): {
  level: string;
  color: string;
} {
  if (percentage >= 90) {
    return { level: 'Excellent', color: 'success' };
  } else if (percentage >= 75) {
    return { level: 'Very Good', color: 'accent' };
  } else if (percentage >= 60) {
    return { level: 'Good', color: 'primary' };
  } else if (percentage >= 40) {
    return { level: 'Average', color: 'warning' };
  } else {
    return { level: 'Needs Improvement', color: 'error' };
  }
}
