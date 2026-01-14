'use client';

import { useState, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Target, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import QuestionDisplay from '@/components/practice/QuestionDisplay';
import AnswerOptions from '@/components/practice/AnswerOptions';
import QuestionNavigation from '@/components/practice/QuestionNavigation';
import { STORAGE_KEYS } from '@/utils/constants';
import questionsData from '@/data/questions.json';
import { QuestionsData } from '@/types';

const questions: QuestionsData = questionsData as QuestionsData;

interface PracticeSession {
  topicStats: Record<string, { attempted: number; correct: number }>;
  sessions: {
    topicId: string;
    date: string;
    correct: number;
    total: number;
  }[];
}

export default function PracticeSessionPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = decodeURIComponent(params.topicId as string);

  // Parse section and topic from topicId
  const [section, topic] = useMemo(() => {
    // Find the section and topic by matching
    for (const q of questions.questions) {
      const testId = `${q.section}-${q.topic}`.toLowerCase().replace(/\s+/g, '-');
      if (testId === topicId) {
        return [q.section, q.topic];
      }
    }
    return ['', ''];
  }, [topicId]);

  // Get questions for this topic
  const topicQuestions = useMemo(() => {
    if (!section || !topic) return [];
    return questions.questions.filter(
      (q) => q.section === section && q.topic === topic
    );
  }, [section, topic]);

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<Record<number, { selected: number; correct: boolean }>>({});
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = topicQuestions[currentIndex];

  // Calculate results
  const results = useMemo(() => {
    const answeredCount = Object.keys(answers).length;
    const correctCount = Object.values(answers).filter((a) => a.correct).length;
    const accuracy = answeredCount > 0 ? (correctCount / answeredCount) * 100 : 0;

    return {
      answered: answeredCount,
      correct: correctCount,
      incorrect: answeredCount - correctCount,
      accuracy,
      total: topicQuestions.length,
    };
  }, [answers, topicQuestions.length]);

  // Save progress to localStorage
  const saveProgress = useCallback(() => {
    const key = `${section}-${topic}`;
    const storedData = localStorage.getItem(STORAGE_KEYS.PRACTICE_SESSIONS);
    let practiceData: PracticeSession = {
      topicStats: {},
      sessions: [],
    };

    if (storedData) {
      try {
        practiceData = JSON.parse(storedData);
      } catch {
        // Keep default
      }
    }

    // Update topic stats
    if (!practiceData.topicStats[key]) {
      practiceData.topicStats[key] = { attempted: 0, correct: 0 };
    }
    practiceData.topicStats[key].attempted += results.answered;
    practiceData.topicStats[key].correct += results.correct;

    // Add session record
    practiceData.sessions.push({
      topicId: key,
      date: new Date().toISOString(),
      correct: results.correct,
      total: results.answered,
    });

    localStorage.setItem(STORAGE_KEYS.PRACTICE_SESSIONS, JSON.stringify(practiceData));
  }, [section, topic, results]);

  // Handle answer selection
  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  // Handle submit (check answer)
  const handleSubmit = () => {
    if (selectedAnswer === null || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: { selected: selectedAnswer, correct: isCorrect },
    }));
    setShowResult(true);
  };

  // Handle skip
  const handleSkip = () => {
    if (currentIndex < topicQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  // Handle next
  const handleNext = () => {
    if (currentIndex < topicQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(answers[currentIndex + 1]?.selected ?? null);
      setShowResult(answers[currentIndex + 1] !== undefined);
    }
  };

  // Handle previous
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedAnswer(answers[currentIndex - 1]?.selected ?? null);
      setShowResult(answers[currentIndex - 1] !== undefined);
    }
  };

  // Handle finish
  const handleFinish = () => {
    saveProgress();
    setIsComplete(true);
  };

  // Handle restart
  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers({});
    setIsComplete(false);
  };

  // If topic not found
  if (!section || !topic || topicQuestions.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Card className="text-center py-12">
          <h2 className="text-xl font-semibold text-textPrimary mb-2">Topic Not Found</h2>
          <p className="text-textMuted mb-4">
            The requested topic could not be found or has no questions.
          </p>
          <Button onClick={() => router.push('/practice')}>
            Back to Practice
          </Button>
        </Card>
      </div>
    );
  }

  // Results screen
  if (isComplete) {
    const grade =
      results.accuracy >= 80
        ? 'Excellent'
        : results.accuracy >= 60
        ? 'Good'
        : results.accuracy >= 40
        ? 'Needs Improvement'
        : 'Keep Practicing';

    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card className="text-center py-8">
          <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
            <Trophy size={48} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-textPrimary mb-2">Practice Complete!</h1>
          <p className="text-textMuted mb-6">{topic} - {section}</p>

          <div className="inline-block mb-6">
            <Badge
              variant={
                results.accuracy >= 70
                  ? 'success'
                  : results.accuracy >= 50
                  ? 'warning'
                  : 'error'
              }
              size="lg"
            >
              {grade}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-surfaceLight rounded-lg">
              <div className="flex items-center justify-center gap-2 text-success mb-1">
                <CheckCircle2 size={20} />
                <span className="text-2xl font-bold">{results.correct}</span>
              </div>
              <p className="text-xs text-textMuted">Correct</p>
            </div>
            <div className="p-4 bg-surfaceLight rounded-lg">
              <div className="flex items-center justify-center gap-2 text-error mb-1">
                <XCircle size={20} />
                <span className="text-2xl font-bold">{results.incorrect}</span>
              </div>
              <p className="text-xs text-textMuted">Incorrect</p>
            </div>
            <div className="p-4 bg-surfaceLight rounded-lg">
              <div className="flex items-center justify-center gap-2 text-primary mb-1">
                <Target size={20} />
                <span className="text-2xl font-bold">{results.accuracy.toFixed(0)}%</span>
              </div>
              <p className="text-xs text-textMuted">Accuracy</p>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={handleRestart}
              icon={<RotateCcw size={18} />}
            >
              Practice Again
            </Button>
            <Button
              variant="primary"
              onClick={() => router.push('/practice')}
            >
              Back to Topics
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/practice')}
            className="p-2 rounded-lg hover:bg-surfaceLight transition-colors"
          >
            <ArrowLeft size={20} className="text-textSecondary" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-textPrimary">{topic}</h1>
            <p className="text-sm text-textMuted">{section}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-textSecondary">
          <span className="text-success">{results.correct} correct</span>
          <span>•</span>
          <span>{results.answered}/{topicQuestions.length} answered</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <QuestionDisplay
              questionNumber={currentIndex + 1}
              totalQuestions={topicQuestions.length}
              question={currentQuestion.question}
              passage={currentQuestion.passage}
              section={currentQuestion.section}
              topic={currentQuestion.topic}
              difficulty={currentQuestion.difficulty}
              marks={currentQuestion.marks}
              negativeMarks={currentQuestion.negativeMarks}
            />
          </Card>

          <Card>
            <AnswerOptions
              options={currentQuestion.options}
              selectedOption={selectedAnswer}
              correctAnswer={showResult ? currentQuestion.correctAnswer : undefined}
              showResult={showResult}
              onSelect={handleSelectAnswer}
              disabled={showResult}
            />
          </Card>

          {/* Explanation */}
          {showResult && (
            <Card className="border-l-4 border-primary">
              <h4 className="font-semibold text-textPrimary mb-2">Explanation</h4>
              <p className="text-textSecondary leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </Card>
          )}
        </div>

        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <QuestionNavigation
              currentQuestion={currentIndex + 1}
              totalQuestions={topicQuestions.length}
              answeredQuestions={new Set(Object.keys(answers).map(Number))}
              hasSelectedAnswer={selectedAnswer !== null}
              showResult={showResult}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={handleSubmit}
              onSkip={handleSkip}
              onFinish={handleFinish}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
