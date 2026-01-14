import Link from 'next/link';
import { Brain, CheckCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface QuizPromptProps {
  quizId: string;
  questionCount: number;
  articleTitle: string;
}

export default function QuizPrompt({ quizId, questionCount, articleTitle }: QuizPromptProps) {
  return (
    <Card className="mt-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 rounded-lg bg-primary/20">
          <Brain size={32} className="text-primary" />
        </div>

        <div className="flex-1">
          <h4 className="text-xl font-bold text-textPrimary mb-2">
            Test Your Understanding
          </h4>
          <p className="text-textSecondary mb-4">
            You&apos;ve just read <span className="font-semibold text-textPrimary">{articleTitle}</span>. Take this {questionCount}-question quiz to test how well you understood the article!
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <Link href={`/current-affairs/quiz/${quizId}`}>
              <Button variant="primary" icon={<CheckCircle size={18} />}>
                Start Quiz ({questionCount} Questions)
              </Button>
            </Link>

            <div className="flex items-center gap-2 text-sm text-textMuted">
              <span>⏱️ ~{questionCount * 2} minutes</span>
              <span>•</span>
              <span>💯 Instant feedback</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
