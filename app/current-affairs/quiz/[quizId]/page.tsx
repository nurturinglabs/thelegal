'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Progress from '@/components/ui/Progress';
import Badge from '@/components/ui/Badge';
import { useQuiz } from '@/hooks/useQuiz';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/utils/constants';
import { getCurrentDate } from '@/utils/date';
import articlesData from '@/data/currentAffairs.json';
import questionsData from '@/data/questions.json';
import { ArticlesData, QuestionsData, CAQuizAttemptsData } from '@/types';

const articles: ArticlesData = articlesData as ArticlesData;
const allQuestions: QuestionsData = questionsData as QuestionsData;

export default function CAQuizPage({ params }: { params: { quizId: string } }) {
  // Find the article and its quiz questions
  const article = articles.articles.find((a) => a.quiz?.id === params.quizId);

  if (!article || !article.quiz) {
    notFound();
  }

  // Get quiz questions by matching quiz ID pattern
  // Quiz ID format: quiz-ca-001 -> Questions format: q-ca-001-1, q-ca-001-2, etc.
  const quizNumber = params.quizId.replace('quiz-ca-', '');
  const quizQuestions = allQuestions.questions.filter((q) =>
    q.id.startsWith(`q-ca-${quizNumber}-`)
  );

  const {
    currentQuestion,
    currentQuestionIndex,
    answers,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    calculateResults,
    getProgress,
    totalQuestions,
  } = useQuiz(quizQuestions);

  const [, setQuizAttempts] = useLocalStorage<CAQuizAttemptsData>(
    STORAGE_KEYS.CA_QUIZ_ATTEMPTS,
    { attempts: [] }
  );

  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<ReturnType<typeof calculateResults> | null>(null);

  const handleSubmit = () => {
    const score = calculateResults();
    setResults(score);
    setShowResults(true);

    // Store attempt in localStorage
    const attempt = {
      quizId: params.quizId,
      articleId: article.id,
      date: getCurrentDate(),
      score: score.score,
      total: score.totalQuestions,
      answers,
    };

    setQuizAttempts((prev) => ({
      attempts: [...prev.attempts, attempt],
    }));

    submitQuiz();
  };

  if (quizQuestions.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-center text-textMuted">Quiz questions are being prepared...</p>
      </div>
    );
  }

  // Results View
  if (showResults && results) {
    const percentage = (results.score / results.totalQuestions) * 100;

    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <Card className="text-center">
          <div className="mb-6">
            {percentage >= 80 ? (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/20 mb-4">
                <CheckCircle size={48} className="text-success" />
              </div>
            ) : percentage >= 60 ? (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-warning/20 mb-4">
                <CheckCircle size={48} className="text-warning" />
              </div>
            ) : (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-error/20 mb-4">
                <XCircle size={48} className="text-error" />
              </div>
            )}

            <h2 className="text-3xl font-bold text-textPrimary mb-2">Quiz Completed!</h2>
            <p className="text-textSecondary">
              You&apos;ve completed the quiz for <span className="font-semibold">{article.title}</span>
            </p>
          </div>

          {/* Score */}
          <div className="bg-surfaceLight rounded-lg p-6 mb-6">
            <div className="text-5xl font-bold text-primary mb-2">
              {results.score}/{results.totalQuestions}
            </div>
            <p className="text-textMuted">
              {percentage.toFixed(1)}% Accuracy
            </p>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-success mb-1">{results.correct}</div>
              <p className="text-xs text-textMuted">Correct</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-error mb-1">{results.incorrect}</div>
              <p className="text-xs text-textMuted">Incorrect</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-textMuted mb-1">{results.unattempted}</div>
              <p className="text-xs text-textMuted">Skipped</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/current-affairs/${article.id}`}>
              <Button variant="outline" fullWidth>
                Read Article Again
              </Button>
            </Link>
            <Link href="/current-affairs">
              <Button variant="primary" fullWidth>
                Browse More Articles
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Quiz View
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link href={`/current-affairs/${article.id}`} className="inline-block mb-4">
          <Button variant="ghost" icon={<ArrowLeft size={18} />} size="sm">
            Back to Article
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-textPrimary mb-1">Current Affairs Quiz</h1>
            <p className="text-textSecondary">{article.title}</p>
          </div>
          <Badge variant="info" size="lg">
            Question {currentQuestionIndex + 1}/{totalQuestions}
          </Badge>
        </div>

        <Progress value={getProgress()} max={100} color="primary" />
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-textPrimary mb-4">
            {currentQuestion.question}
          </h2>

          {currentQuestion.passage && (
            <div className="mb-4 p-4 bg-surfaceLight rounded-lg">
              <p className="text-sm text-textSecondary">{currentQuestion.passage}</p>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => selectAnswer(currentQuestion.id, index)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                answers[currentQuestion.id] === index
                  ? 'border-primary bg-primary/10 text-textPrimary'
                  : 'border-border hover:border-primary/50 text-textSecondary hover:text-textPrimary'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <div className="text-sm text-textMuted">
          {Object.keys(answers).length} of {totalQuestions} answered
        </div>

        {currentQuestionIndex === totalQuestions - 1 ? (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length === 0}
          >
            Submit Quiz
          </Button>
        ) : (
          <Button variant="primary" onClick={nextQuestion}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
