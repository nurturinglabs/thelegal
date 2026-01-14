import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, BookOpen, Award } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import LessonList from '@/components/learn/LessonList';
import modulesData from '@/data/modules.json';
import { ModulesData } from '@/types';

const data: ModulesData = modulesData as ModulesData;

export default function ModuleDetailPage({ params }: { params: { moduleId: string } }) {
  const currentModule = data.modules.find((m) => m.id === params.moduleId);

  if (!currentModule) {
    notFound();
  }

  const completedLessons = currentModule.lessons.filter((l) => l.completed).length;
  const totalLessons = currentModule.lessons.length;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const difficultyColors = {
    easy: 'success',
    medium: 'warning',
    hard: 'error',
  } as const;

  return (
    <div className="container mx-auto p-6">
      {/* Back Button */}
      <Link href="/learn" className="inline-block mb-6">
        <Button variant="ghost" icon={<ArrowLeft size={18} />}>
          Back to Modules
        </Button>
      </Link>

      {/* Module Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge variant={difficultyColors[currentModule.difficulty]} size="md">
            {currentModule.difficulty.charAt(0).toUpperCase() + currentModule.difficulty.slice(1)}
          </Badge>
          <span className="text-sm text-textMuted">{currentModule.section}</span>
        </div>

        <h1 className="text-4xl font-bold text-textPrimary mb-4">
          {currentModule.title}
        </h1>

        <p className="text-lg text-textSecondary mb-6">
          {currentModule.description}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-textMuted">
          <div className="flex items-center gap-2">
            <BookOpen size={18} />
            <span>{totalLessons} lessons</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <span>{currentModule.estimatedTime} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={18} />
            <span>{completedLessons} completed</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Lessons */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-textPrimary mb-2">Lessons</h2>
            <p className="text-textSecondary">
              Complete lessons in order to unlock the next one
            </p>
          </div>

          <LessonList lessons={currentModule.lessons} moduleId={currentModule.id} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Progress Card */}
          <Card>
            <h3 className="text-lg font-semibold text-textPrimary mb-4">Your Progress</h3>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-textSecondary">Completion</span>
                <span className="font-semibold text-textPrimary">
                  {completedLessons}/{totalLessons} lessons
                </span>
              </div>
              <Progress
                value={progressPercentage}
                max={100}
                color="success"
                size="md"
              />
              <p className="text-xs text-textMuted mt-1">
                {Math.round(progressPercentage)}% complete
              </p>
            </div>

            {progressPercentage === 100 ? (
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center gap-2 text-success mb-2">
                  <Award size={20} />
                  <span className="font-semibold">Module Completed!</span>
                </div>
                <p className="text-sm text-textSecondary">
                  Great job! You&apos;ve completed all lessons in this module.
                </p>
              </div>
            ) : (
              <Button variant="primary" fullWidth>
                {completedLessons === 0 ? 'Start First Lesson' : 'Continue Learning'}
              </Button>
            )}
          </Card>

          {/* What You&apos;ll Learn */}
          <Card>
            <h3 className="text-lg font-semibold text-textPrimary mb-4">
              What You&apos;ll Learn
            </h3>
            <ul className="space-y-3">
              {currentModule.lessons.slice(0, 4).map((lesson, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-textSecondary">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  <span>{lesson.title}</span>
                </li>
              ))}
              {currentModule.lessons.length > 4 && (
                <li className="text-xs text-textMuted pl-3.5">
                  + {currentModule.lessons.length - 4} more lessons
                </li>
              )}
            </ul>
          </Card>

          {/* Prerequisites (Coming Soon) */}
          <Card className="bg-surfaceLight border-border">
            <h3 className="text-sm font-semibold text-textMuted mb-2">
              Prerequisites
            </h3>
            <p className="text-xs text-textMuted">
              No prerequisites required. This module is suitable for beginners.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
