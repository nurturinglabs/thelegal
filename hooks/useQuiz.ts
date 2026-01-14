'use client';

import { useState } from 'react';
import { Question } from '@/types';
import { calculateScore } from '@/utils/scoring';

export function useQuiz(questions: Question[]) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const selectAnswer = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const submitQuiz = () => {
    setIsSubmitted(true);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsSubmitted(false);
  };

  const calculateResults = () => {
    const correctAnswers: Record<string, number> = {};
    questions.forEach((q) => {
      correctAnswers[q.id] = q.correctAnswer;
    });

    return calculateScore(answers, correctAnswers, questions.length);
  };

  const isQuestionAnswered = (questionId: string): boolean => {
    return answers[questionId] !== undefined;
  };

  const isAnswerCorrect = (questionId: string): boolean | null => {
    if (!isSubmitted || !isQuestionAnswered(questionId)) {
      return null;
    }
    const question = questions.find((q) => q.id === questionId);
    return question ? answers[questionId] === question.correctAnswer : null;
  };

  const getProgress = (): number => {
    const answeredCount = Object.keys(answers).length;
    return (answeredCount / questions.length) * 100;
  };

  return {
    currentQuestionIndex,
    currentQuestion: questions[currentQuestionIndex],
    answers,
    isSubmitted,
    goToQuestion,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    resetQuiz,
    calculateResults,
    isQuestionAnswered,
    isAnswerCorrect,
    getProgress,
    totalQuestions: questions.length,
  };
}
