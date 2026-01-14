import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ArticleContent from '@/components/current-affairs/ArticleContent';
import BookmarkButton from '@/components/current-affairs/BookmarkButton';
import RelatedArticles from '@/components/current-affairs/RelatedArticles';
import QuizPrompt from '@/components/current-affairs/QuizPrompt';
import Button from '@/components/ui/Button';
import articlesData from '@/data/currentAffairs.json';
import { ArticlesData } from '@/types';

const data: ArticlesData = articlesData as ArticlesData;

export default function ArticleDetailPage({ params }: { params: { articleId: string } }) {
  const article = data.articles.find((a) => a.id === params.articleId);

  if (!article) {
    notFound();
  }

  // Get related articles
  const relatedArticles = data.articles.filter((a) =>
    article.relatedArticles.includes(a.id)
  );

  return (
    <div className="container mx-auto p-6">
      {/* Back Button */}
      <Link href="/current-affairs" className="inline-block mb-6">
        <Button variant="ghost" icon={<ArrowLeft size={18} />}>
          Back to Articles
        </Button>
      </Link>

      {/* Article Content */}
      <div className="mb-8">
        <ArticleContent article={article} />
      </div>

      {/* Actions Bar */}
      <div className="sticky bottom-6 z-10 flex justify-center">
        <div className="bg-surface border border-border rounded-lg shadow-glowLg p-4 flex items-center gap-4">
          <BookmarkButton articleId={article.id} />

          {article.quiz && (
            <Link href={`/current-affairs/quiz/${article.quiz.id}`}>
              <Button variant="primary">
                Take Quiz ({article.quiz.questions} Questions)
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Quiz Prompt */}
      {article.quiz && (
        <div className="max-w-4xl mx-auto">
          <QuizPrompt
            quizId={article.quiz.id}
            questionCount={article.quiz.questions}
            articleTitle={article.title}
          />
        </div>
      )}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <RelatedArticles articles={relatedArticles} />
        </div>
      )}
    </div>
  );
}
