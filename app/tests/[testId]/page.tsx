'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle2,
  BookmarkIcon,
  ChevronLeft,
  Send,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import TestTimer from '@/components/tests/TestTimer';
import testsData from '@/data/tests.json';
import questionsData from '@/data/questions.json';
import { TestsData, QuestionsData, Question } from '@/types';
import { cn } from '@/utils/cn';
import { STORAGE_KEYS } from '@/utils/constants';

const tests: TestsData = testsData as TestsData;
const questions: QuestionsData = questionsData as QuestionsData;

type TestStatus = 'instructions' | 'in_progress' | 'submitted';

interface QuestionState {
  answered: boolean;
  selectedOption: number | null;
  markedForReview: boolean;
  timeSpent: number;
}

export default function TestPage({ params }: { params: { testId: string } }) {
  const router = useRouter();
  const test = tests.tests.find((t) => t.id === params.testId);

  const [status, setStatus] = useState<TestStatus>('instructions');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>({});
  const [showPalette, setShowPalette] = useState(true);

  // Get all question IDs for this test
  const getAllQuestionIds = useCallback(() => {
    if (!test) return [];

    // Collect all questionIds from all sections
    const allIds: string[] = [];
    test.sections.forEach((section) => {
      allIds.push(...section.questionIds);
    });

    // If no questions are defined, use placeholder questions from questions.json
    if (allIds.length === 0) {
      // Use available questions up to the test's totalQuestions
      return questions.questions.slice(0, Math.min(test.totalQuestions, questions.questions.length)).map(q => q.id);
    }

    return allIds;
  }, [test]);

  const testQuestionIds = getAllQuestionIds();

  // Get actual question objects
  const testQuestions: Question[] = testQuestionIds
    .map((id) => questions.questions.find((q) => q.id === id))
    .filter((q): q is Question => q !== undefined);

  const currentQuestion = testQuestions[currentQuestionIndex];

  // Initialize question states
  useEffect(() => {
    if (status === 'in_progress' && Object.keys(questionStates).length === 0) {
      const initialStates: Record<string, QuestionState> = {};
      testQuestionIds.forEach((id) => {
        initialStates[id] = {
          answered: false,
          selectedOption: null,
          markedForReview: false,
          timeSpent: 0,
        };
      });
      setQuestionStates(initialStates);
    }
  }, [status, testQuestionIds, questionStates]);

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

  const handleStartTest = () => {
    setStatus('in_progress');
  };

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;

    setQuestionStates((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        answered: true,
        selectedOption: optionIndex,
      },
    }));
  };

  const handleMarkForReview = () => {
    if (!currentQuestion) return;

    setQuestionStates((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        markedForReview: !prev[currentQuestion.id]?.markedForReview,
      },
    }));
  };

  const handleClearResponse = () => {
    if (!currentQuestion) return;

    setQuestionStates((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        answered: false,
        selectedOption: null,
      },
    }));
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const calculateScore = () => {
    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    testQuestions.forEach((question) => {
      const state = questionStates[question.id];
      if (state?.answered && state.selectedOption !== null) {
        if (state.selectedOption === question.correctAnswer) {
          score += question.marks;
          correct++;
        } else {
          score -= question.negativeMarks;
          incorrect++;
        }
      } else {
        unattempted++;
      }
    });

    return { score: Math.max(0, score), correct, incorrect, unattempted };
  };

  const handleSubmitTest = () => {
    const { score, correct } = calculateScore();

    // Save attempt to localStorage
    const attemptId = `attempt-${Date.now()}`;
    const attempt = {
      attemptId,
      testId: test.id,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      answers: Object.fromEntries(
        Object.entries(questionStates)
          .filter(([, state]) => state.selectedOption !== null)
          .map(([qId, state]) => [qId, state.selectedOption])
      ),
      score,
      accuracy: testQuestions.length > 0 ? (correct / testQuestions.length) * 100 : 0,
      sectionScores: {},
      timeSpent: {},
    };

    // Get existing attempts
    const existingData = localStorage.getItem(STORAGE_KEYS.TEST_ATTEMPTS);
    const existingAttempts = existingData ? JSON.parse(existingData) : { attempts: [] };
    existingAttempts.attempts.push(attempt);
    localStorage.setItem(STORAGE_KEYS.TEST_ATTEMPTS, JSON.stringify(existingAttempts));

    // Navigate to results
    router.push(`/tests/results/${attemptId}`);
  };

  const handleTimeUp = () => {
    handleSubmitTest();
  };

  const getQuestionStats = () => {
    let answered = 0;
    let markedForReview = 0;
    let notVisited = 0;

    testQuestionIds.forEach((id) => {
      const state = questionStates[id];
      if (state?.answered) answered++;
      if (state?.markedForReview) markedForReview++;
      if (!state || (!state.answered && !state.markedForReview)) notVisited++;
    });

    return { answered, markedForReview, notVisited };
  };

  // Instructions Screen
  if (status === 'instructions') {
    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <Link href="/tests" className="inline-block mb-6">
          <Button variant="ghost" icon={<ChevronLeft size={18} />}>
            Back to Tests
          </Button>
        </Link>

        <Card className="mb-6">
          <div className="text-center mb-6">
            <Badge variant="info" size="lg" className="mb-4">
              {test.type === 'full_length' ? 'Full Length Test' : test.type === 'sectional' ? 'Sectional Test' : 'Previous Year'}
            </Badge>
            <h1 className="text-3xl font-bold text-textPrimary mb-2">{test.title}</h1>
          </div>

          {/* Test Info */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-surfaceLight rounded-lg">
            <div className="text-center">
              <Clock size={24} className="text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-textPrimary">{test.duration}</p>
              <p className="text-sm text-textMuted">Minutes</p>
            </div>
            <div className="text-center border-x border-border">
              <FileText size={24} className="text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-textPrimary">{test.totalQuestions}</p>
              <p className="text-sm text-textMuted">Questions</p>
            </div>
            <div className="text-center">
              <CheckCircle2 size={24} className="text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-textPrimary">{test.totalMarks}</p>
              <p className="text-sm text-textMuted">Marks</p>
            </div>
          </div>

          {/* Sections */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-textPrimary mb-3">Sections</h3>
            <div className="space-y-2">
              {test.sections.map((section) => (
                <div
                  key={section.name}
                  className="flex justify-between items-center p-3 bg-surfaceLight rounded-lg"
                >
                  <span className="text-textSecondary">{section.name}</span>
                  <span className="font-semibold text-textPrimary">{section.questions} questions</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-textPrimary mb-3">Instructions</h3>
            <ul className="space-y-2">
              {test.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-2 text-textSecondary">
                  <AlertCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legend */}
          <div className="mb-6 p-4 bg-surfaceLight rounded-lg">
            <h4 className="text-sm font-semibold text-textPrimary mb-3">Question Palette Legend</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-success flex items-center justify-center text-white text-xs">1</span>
                <span className="text-textSecondary">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-surfaceLight border border-border flex items-center justify-center text-textMuted text-xs">2</span>
                <span className="text-textSecondary">Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-warning flex items-center justify-center text-white text-xs">3</span>
                <span className="text-textSecondary">Marked for Review</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white text-xs">4</span>
                <span className="text-textSecondary">Current Question</span>
              </div>
            </div>
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={handleStartTest}>
            Start Test
          </Button>
        </Card>
      </div>
    );
  }

  // Test Interface
  const stats = getQuestionStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-surface border-b border-border px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-textPrimary hidden sm:block">
              {test.title}
            </h1>
            <Badge variant="info" size="sm">
              Q {currentQuestionIndex + 1}/{testQuestions.length}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <TestTimer
              durationMinutes={test.duration}
              onTimeUp={handleTimeUp}
            />
            <Button
              variant="primary"
              size="sm"
              icon={<Send size={16} />}
              onClick={handleSubmitTest}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="flex gap-4">
          {/* Main Content */}
          <div className="flex-1">
            {currentQuestion ? (
              <Card className="mb-4">
                {/* Question Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-textMuted">
                      Question {currentQuestionIndex + 1}
                    </span>
                    <Badge variant="neutral" size="sm">{currentQuestion.section}</Badge>
                    <Badge
                      variant={
                        currentQuestion.difficulty === 'easy'
                          ? 'success'
                          : currentQuestion.difficulty === 'medium'
                          ? 'warning'
                          : 'error'
                      }
                      size="sm"
                    >
                      {currentQuestion.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-textMuted">
                    <span>+{currentQuestion.marks}</span>
                    <span className="text-error">-{currentQuestion.negativeMarks}</span>
                  </div>
                </div>

                {/* Question Text */}
                <div className="mb-6">
                  <p className="text-lg text-textPrimary leading-relaxed">
                    {currentQuestion.question}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = questionStates[currentQuestion.id]?.selectedOption === index;
                    return (
                      <button
                        key={index}
                        onClick={() => handleSelectOption(index)}
                        className={cn(
                          'w-full p-4 rounded-lg border text-left transition-all',
                          isSelected
                            ? 'bg-primary/10 border-primary text-textPrimary'
                            : 'bg-surfaceLight border-border text-textSecondary hover:border-primary/50 hover:bg-surfaceLight'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                              isSelected
                                ? 'bg-primary text-white'
                                : 'bg-surface border border-border text-textMuted'
                            )}
                          >
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span>{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearResponse}
                  >
                    Clear Response
                  </Button>
                  <Button
                    variant={questionStates[currentQuestion.id]?.markedForReview ? 'primary' : 'outline'}
                    size="sm"
                    icon={<BookmarkIcon size={16} />}
                    onClick={handleMarkForReview}
                  >
                    {questionStates[currentQuestion.id]?.markedForReview ? 'Marked' : 'Mark for Review'}
                  </Button>
                </div>
              </Card>
            ) : (
              <Card>
                <p className="text-center text-textSecondary py-8">
                  No questions available for this test yet.
                </p>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                icon={<ArrowLeft size={18} />}
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                iconPosition="right"
                icon={<ArrowRight size={18} />}
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === testQuestions.length - 1}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Question Palette - Desktop */}
          <div className="hidden lg:block w-72">
            <Card className="sticky top-24">
              <h3 className="text-sm font-semibold text-textPrimary mb-4">
                Question Palette
              </h3>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
                <div className="p-2 bg-success/10 rounded">
                  <p className="font-semibold text-success">{stats.answered}</p>
                  <p className="text-textMuted">Answered</p>
                </div>
                <div className="p-2 bg-warning/10 rounded">
                  <p className="font-semibold text-warning">{stats.markedForReview}</p>
                  <p className="text-textMuted">Review</p>
                </div>
                <div className="p-2 bg-surfaceLight rounded">
                  <p className="font-semibold text-textSecondary">{stats.notVisited}</p>
                  <p className="text-textMuted">Not Ans</p>
                </div>
              </div>

              {/* Question Grid */}
              <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
                {testQuestions.map((q, index) => {
                  const state = questionStates[q.id];
                  const isCurrent = index === currentQuestionIndex;
                  const isAnswered = state?.answered;
                  const isMarked = state?.markedForReview;

                  return (
                    <button
                      key={q.id}
                      onClick={() => handleJumpToQuestion(index)}
                      className={cn(
                        'w-10 h-10 rounded text-sm font-medium transition-colors',
                        isCurrent && 'ring-2 ring-primary ring-offset-2 ring-offset-surface',
                        isAnswered && !isMarked && 'bg-success text-white',
                        isMarked && 'bg-warning text-white',
                        !isAnswered && !isMarked && 'bg-surfaceLight text-textMuted hover:bg-border'
                      )}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Question Palette Toggle */}
      <button
        onClick={() => setShowPalette(!showPalette)}
        className="lg:hidden fixed bottom-4 right-4 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center"
      >
        <span className="text-sm font-semibold">{stats.answered}/{testQuestions.length}</span>
      </button>
    </div>
  );
}
