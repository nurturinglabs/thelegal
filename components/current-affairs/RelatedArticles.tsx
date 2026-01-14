import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import CategoryBadge from './CategoryBadge';
import { Article } from '@/types';
import { formatDate } from '@/utils/date';

interface RelatedArticlesProps {
  articles: Article[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h3 className="text-2xl font-bold text-textPrimary mb-6">Related Articles</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link key={article.id} href={`/current-affairs/${article.id}`}>
            <Card variant="interactive" className="h-full">
              <CategoryBadge category={article.category} size="sm" />

              <h4 className="text-base font-semibold text-textPrimary mt-3 mb-2 line-clamp-2 hover:text-primary transition-colors">
                {article.title}
              </h4>

              <p className="text-sm text-textSecondary mb-3 line-clamp-2">
                {article.excerpt}
              </p>

              <div className="flex items-center justify-between text-xs text-textMuted">
                <span>{formatDate(article.date, 'MMM dd')}</span>
                <div className="flex items-center gap-1 text-primary font-medium">
                  Read more
                  <ArrowRight size={14} />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
