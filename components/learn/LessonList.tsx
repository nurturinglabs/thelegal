'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle2, ChevronRight, Lock, FileText } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Lesson } from '@/types';
import { cn } from '@/utils/cn';

interface LessonListProps {
  lessons: Lesson[];
  moduleId: string;
}

// Extract a brief description from the lesson content
function getLessonDescription(content: string, type: Lesson['type']): string {
  if (type === 'quiz') {
    return content.length > 150 ? content.slice(0, 150) + '...' : content;
  }

  // Remove markdown formatting and get first meaningful paragraph
  const cleanContent = content
    .replace(/^#+\s+.+$/gm, '') // Remove headings
    .replace(/^\s*>\s*.+$/gm, '') // Remove blockquotes
    .replace(/\|.+\|/g, '') // Remove table rows
    .replace(/^[-*]\s+/gm, '') // Remove list markers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/`([^`]+)`/g, '$1') // Remove code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/---+/g, '') // Remove horizontal rules
    .replace(/\n{2,}/g, '\n') // Collapse multiple newlines
    .trim();

  // Get first 150 characters of meaningful text
  const lines = cleanContent.split('\n').filter(line => line.trim().length > 20);
  const firstLine = lines[0] || cleanContent.slice(0, 150);

  return firstLine.length > 150 ? firstLine.slice(0, 150) + '...' : firstLine;
}

export default function LessonList({ lessons, moduleId }: LessonListProps) {
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'reading':
        return <BookOpen size={20} className="text-accent" />;
      case 'quiz':
        return <CheckCircle2 size={20} className="text-success" />;
      default:
        return <FileText size={20} className="text-textMuted" />;
    }
  };

  const getLessonBadge = (type: Lesson['type']) => {
    switch (type) {
      case 'reading':
        return <Badge variant="success" size="sm">Reading</Badge>;
      case 'quiz':
        return <Badge variant="warning" size="sm">Quiz</Badge>;
      default:
        return <Badge variant="info" size="sm">Lesson</Badge>;
    }
  };

  return (
    <div className="space-y-3">
      {lessons.map((lesson, index) => {
        const isExpanded = expandedLesson === lesson.id;
        const isLocked = index > 0 && !lessons[index - 1].completed;

        return (
          <Card
            key={lesson.id}
            variant={lesson.completed ? 'bordered' : 'default'}
            className={cn(
              'transition-all cursor-pointer',
              lesson.completed && 'bg-success/5 border-success/20',
              isLocked && 'opacity-60 cursor-not-allowed'
            )}
            onClick={() => !isLocked && setExpandedLesson(isExpanded ? null : lesson.id)}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 mt-1">
                {lesson.completed ? (
                  <CheckCircle2 size={24} className="text-success" />
                ) : isLocked ? (
                  <Lock size={24} className="text-textMuted" />
                ) : (
                  getLessonIcon(lesson.type)
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-textMuted font-medium">
                        Lesson {index + 1}
                      </span>
                      {getLessonBadge(lesson.type)}
                    </div>
                    <h4 className="text-base font-semibold text-textPrimary mb-1">
                      {lesson.title}
                    </h4>
                    <p className="text-sm text-textMuted">
                      {lesson.duration} minutes
                      {lesson.completed && ' • Completed'}
                      {isLocked && ' • Locked'}
                    </p>
                  </div>

                  <ChevronRight
                    size={20}
                    className={cn(
                      'text-textMuted transition-transform',
                      isExpanded && 'rotate-90'
                    )}
                  />
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-sm text-textSecondary mb-3">
                      {getLessonDescription(lesson.content, lesson.type)}
                    </p>
                    <Link href={`/learn/${moduleId}/${lesson.id}`}>
                      <button
                        className={cn(
                          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                          lesson.completed
                            ? 'bg-surfaceLight text-textSecondary hover:bg-border'
                            : 'bg-primary text-white hover:bg-primaryDark'
                        )}
                        disabled={isLocked}
                      >
                        {lesson.completed ? 'Review Lesson' : 'Start Lesson'}
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
