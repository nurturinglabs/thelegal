'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import modulesData from '@/data/modules.json';
import { ModulesData } from '@/types';

const data: ModulesData = modulesData as ModulesData;

export default function LessonPage({
  params,
}: {
  params: { moduleId: string; lessonId: string };
}) {
  const currentModule = data.modules.find((m) => m.id === params.moduleId);

  if (!currentModule) {
    notFound();
  }

  const lessonIndex = currentModule.lessons.findIndex((l) => l.id === params.lessonId);
  const lesson = currentModule.lessons[lessonIndex];

  if (!lesson) {
    notFound();
  }

  const nextLesson = lessonIndex < currentModule.lessons.length - 1 ? currentModule.lessons[lessonIndex + 1] : null;
  const prevLesson = lessonIndex > 0 ? currentModule.lessons[lessonIndex - 1] : null;

  const lessonTypeDisplay = lesson.type === 'reading' ? 'Reading Material' : 'Practice Quiz';

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Back Button */}
      <Link href={`/learn/${params.moduleId}`} className="inline-block mb-6">
        <Button variant="ghost" icon={<ArrowLeft size={18} />}>
          Back to Module
        </Button>
      </Link>

      {/* Lesson Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="info" size="sm">
            Lesson {lessonIndex + 1} of {currentModule.lessons.length}
          </Badge>
          <Badge variant={lesson.type === 'quiz' ? 'warning' : 'success'} size="sm">
            {lessonTypeDisplay}
          </Badge>
          <span className="text-sm text-textMuted">{currentModule.section}</span>
        </div>

        <h1 className="text-4xl font-bold text-textPrimary mb-4">{lesson.title}</h1>

        <div className="flex items-center gap-6 text-sm text-textMuted">
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <span>{lesson.duration} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen size={18} />
            <span>{currentModule.title}</span>
          </div>
          {lesson.completed && (
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 size={18} />
              <span>Completed</span>
            </div>
          )}
        </div>
      </div>

      {/* Lesson Content */}
      <Card className="mb-8">
        <div className="max-w-none">
          {lesson.type === 'reading' ? (
            <div className="lesson-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-textPrimary mt-8 mb-4 pb-2 border-b border-border">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-textPrimary mt-6 mb-3">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-lg font-semibold text-primary mt-4 mb-2">
                      {children}
                    </h4>
                  ),
                  p: ({ children }) => (
                    <p className="text-textSecondary leading-relaxed mb-4">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-2 mb-4 text-textSecondary ml-4">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-2 mb-4 text-textSecondary ml-4">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-textSecondary">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-textPrimary">{children}</strong>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto mb-6">
                      <table className="w-full border-collapse border border-border rounded-lg">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-surfaceLight">{children}</thead>
                  ),
                  th: ({ children }) => (
                    <th className="border border-border px-4 py-2 text-left text-textPrimary font-semibold">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-border px-4 py-2 text-textSecondary">
                      {children}
                    </td>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 bg-primary/5 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="bg-surfaceLight px-2 py-1 rounded text-sm text-primary font-mono">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-surfaceLight p-4 rounded-lg overflow-x-auto mb-4 text-sm">
                      {children}
                    </pre>
                  ),
                  hr: () => <hr className="border-border my-6" />,
                }}
              >
                {lesson.content}
              </ReactMarkdown>
            </div>
          ) : (
            // Quiz lesson
            <div className="space-y-6">
              <div className="text-lg text-textSecondary mb-6">
                {lesson.content}
              </div>

              <div className="p-6 bg-surfaceLight rounded-lg border border-border text-center">
                <CheckCircle2 size={48} className="text-warning mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-textPrimary mb-2">
                  Practice Quiz
                </h3>
                <p className="text-textSecondary mb-6">
                  Test your understanding with {lesson.questionIds?.length || 5} practice questions.
                </p>
                <Button variant="primary" size="lg">
                  Start Quiz
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        {prevLesson ? (
          <Link href={`/learn/${params.moduleId}/${prevLesson.id}`} className="flex-1">
            <Button variant="outline" fullWidth icon={<ArrowLeft size={18} />}>
              Previous: {prevLesson.title}
            </Button>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {nextLesson ? (
          <Link href={`/learn/${params.moduleId}/${nextLesson.id}`} className="flex-1">
            <Button variant="primary" fullWidth iconPosition="right" icon={<ChevronRight size={18} />}>
              Next: {nextLesson.title}
            </Button>
          </Link>
        ) : (
          <Link href={`/learn/${params.moduleId}`} className="flex-1">
            <Button variant="primary" fullWidth icon={<CheckCircle2 size={18} />}>
              Complete Module
            </Button>
          </Link>
        )}
      </div>

      {/* Mark as Complete */}
      {!lesson.completed && (
        <Card className="bg-primary/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-textPrimary mb-1">
                Mark as Complete
              </h3>
              <p className="text-sm text-textSecondary">
                Completed this lesson? Mark it as done to track your progress.
              </p>
            </div>
            <Button variant="primary" icon={<CheckCircle2 size={18} />}>
              Mark Complete
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
