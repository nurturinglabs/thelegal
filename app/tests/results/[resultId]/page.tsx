'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Target,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ArrowLeft,
  RotateCcw,
  Eye,
  Share2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import testsData from '@/data/tests.json';
import questionsData from '@/data/questions.json';
import { TestsData, QuestionsData, TestAttempt, Question } from '@/types';
import { cn } from '@/utils/cn';
import { STORAGE_KEYS } from '@/utils/constants';

const tests: TestsData = testsData as TestsData;
const questions: QuestionsData = questionsData as QuestionsData;

export default function ResultsPage({ params }: { params: { resultId: string } }) {
  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEYS.TEST_ATTEMPTS);
    if (data) {
      const { attempts } = JSON.parse(data);
      const found = attempts.find((a: TestAttempt) => a.attemptId === params.resultId);
      if (found) {
        setAttempt(found);
      }
    }
  }, [params.resultId]);

  if (!attempt) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-textPrimary mb-4">Result not found</h1>
        <p className="text-textSecondary mb-6">
          The test result you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>
        <Link href="/tests">
          <Button variant="primary">Back to Tests</Button>
        </Link>
      </div>
    );
  }

  const test = tests.tests.find((t) => t.id === attempt.testId);
  if (!test) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-textPrimary mb-4">Test not found</h1>
        <Link href="/tests">
          <Button variant="primary">Back to Tests</Button>
        </Link>
      </div>
    );
  }

  // Calculate stats
  const answeredQuestions = Object.keys(attempt.answers).length;
  const totalQuestions = test.totalQuestions;
  const correctAnswers = Object.entries(attempt.answers).filter(([qId, answer]) => {
    const question = questions.questions.find((q) => q.id === qId);
    return question && question.correctAnswer === answer;
  }).length;
  const incorrectAnswers = answeredQuestions - correctAnswers;
  const unattempted = totalQuestions - answeredQuestions;
  const accuracy = answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0;
  const percentile = Math.min(99, Math.round(accuracy * 0.95)); // Mock percentile

  const getGrade = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return { grade: 'A+', color: 'text-success' };
    if (percentage >= 80) return { grade: 'A', color: 'text-success' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-primary' };
    if (percentage >= 60) return { grade: 'B', color: 'text-primary' };
    if (percentage >= 50) return { grade: 'C', color: 'text-warning' };
    return { grade: 'D', color: 'text-error' };
  };

  const { grade, color } = getGrade(attempt.score, test.totalMarks);

  // Get answered questions for review
  const getTestQuestions = () => {
    const allIds: string[] = [];
    test.sections.forEach((section) => {
      allIds.push(...section.questionIds);
    });

    if (allIds.length === 0) {
      return questions.questions.slice(0, Math.min(test.totalQuestions, questions.questions.length));
    }

    return allIds
      .map((id) => questions.questions.find((q) => q.id === id))
      .filter((q): q is Question => q !== undefined);
  };

  const testQuestions = getTestQuestions();

  return (
    <div className="container mx-auto p-6 max-w-5xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/tests">
          <Button variant="ghost" icon={<ArrowLeft size={18} />}>
            Back to Tests
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<Share2 size={16} />}>
            Share
          </Button>
        </div>
      </div>

      {/* Score Card */}
      <Card className="mb-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <div className="text-center py-4">
          <Trophy size={48} className="text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-textPrimary mb-2">
            Test Completed!
          </h1>
          <p className="text-textSecondary mb-6">{test.title}</p>

          <div className="flex justify-center items-baseline gap-2 mb-4">
            <span className="text-6xl font-bold text-textPrimary">{attempt.score.toFixed(1)}</span>
            <span className="text-2xl text-textMuted">/ {test.totalMarks}</span>
          </div>

          <div className="flex justify-center items-center gap-4 mb-6">
            <Badge variant="primary" size="lg">
              Grade: <span className={cn('font-bold', color)}>{grade}</span>
            </Badge>
            <Badge variant="info" size="lg">
              Top {100 - percentile}%
            </Badge>
          </div>

          <Progress
            value={attempt.score}
            max={test.totalMarks}
            color="success"
            size="lg"
            className="max-w-md mx-auto"
          />
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="text-center">
          <CheckCircle2 size={24} className="text-success mx-auto mb-2" />
          <p className="text-2xl font-bold text-textPrimary">{correctAnswers}</p>
          <p className="text-sm text-textMuted">Correct</p>
        </Card>
        <Card className="text-center">
          <XCircle size={24} className="text-error mx-auto mb-2" />
          <p className="text-2xl font-bold text-textPrimary">{incorrectAnswers}</p>
          <p className="text-sm text-textMuted">Incorrect</p>
        </Card>
        <Card className="text-center">
          <MinusCircle size={24} className="text-textMuted mx-auto mb-2" />
          <p className="text-2xl font-bold text-textPrimary">{unattempted}</p>
          <p className="text-sm text-textMuted">Unattempted</p>
        </Card>
        <Card className="text-center">
          <Target size={24} className="text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-textPrimary">{accuracy.toFixed(1)}%</p>
          <p className="text-sm text-textMuted">Accuracy</p>
        </Card>
      </div>

      {/* Performance Analysis */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-textPrimary mb-4">
          Performance Analysis
        </h2>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-textSecondary">Questions Attempted</span>
              <span className="text-textPrimary font-medium">
                {answeredQuestions}/{totalQuestions}
              </span>
            </div>
            <Progress
              value={answeredQuestions}
              max={totalQuestions}
              color="primary"
              size="sm"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-textSecondary">Correct Answers</span>
              <span className="text-success font-medium">
                {correctAnswers}/{answeredQuestions}
              </span>
            </div>
            <Progress
              value={correctAnswers}
              max={answeredQuestions || 1}
              color="success"
              size="sm"
            />
          </div>

          <div className="pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-textMuted mb-1">Marks from Correct</p>
                <p className="text-xl font-semibold text-success">+{correctAnswers}</p>
              </div>
              <div>
                <p className="text-textMuted mb-1">Negative Marking</p>
                <p className="text-xl font-semibold text-error">-{(incorrectAnswers * 0.25).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Review Answers */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-textPrimary">
            Review Answers
          </h2>
          <Button
            variant="outline"
            size="sm"
            icon={<Eye size={16} />}
            onClick={() => setShowAnswers(!showAnswers)}
          >
            {showAnswers ? 'Hide Answers' : 'Show Answers'}
          </Button>
        </div>

        {showAnswers && (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {testQuestions.map((question, index) => {
              const userAnswer = attempt.answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              const wasAttempted = userAnswer !== undefined;

              return (
                <div
                  key={question.id}
                  className={cn(
                    'p-4 rounded-lg border',
                    wasAttempted
                      ? isCorrect
                        ? 'bg-success/5 border-success/20'
                        : 'bg-error/5 border-error/20'
                      : 'bg-surfaceLight border-border'
                  )}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-sm text-textPrimary">
                      <span className="font-semibold">Q{index + 1}.</span> {question.question}
                    </p>
                    {wasAttempted ? (
                      isCorrect ? (
                        <CheckCircle2 size={20} className="text-success flex-shrink-0" />
                      ) : (
                        <XCircle size={20} className="text-error flex-shrink-0" />
                      )
                    ) : (
                      <MinusCircle size={20} className="text-textMuted flex-shrink-0" />
                    )}
                  </div>

                  <div className="text-sm space-y-1">
                    {wasAttempted && !isCorrect && (
                      <p className="text-error">
                        Your answer: {String.fromCharCode(65 + userAnswer)}. {question.options[userAnswer]}
                      </p>
                    )}
                    <p className="text-success">
                      Correct answer: {String.fromCharCode(65 + question.correctAnswer)}. {question.options[question.correctAnswer]}
                    </p>
                    <p className="text-textMuted mt-2 text-xs">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!showAnswers && (
          <p className="text-center text-textMuted py-8">
            Click &quot;Show Answers&quot; to review your answers with explanations
          </p>
        )}
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href={`/tests/${test.id}`} className="flex-1">
          <Button variant="primary" fullWidth icon={<RotateCcw size={18} />}>
            Reattempt Test
          </Button>
        </Link>
        <Link href="/tests" className="flex-1">
          <Button variant="outline" fullWidth>
            Back to All Tests
          </Button>
        </Link>
      </div>
    </div>
  );
}
