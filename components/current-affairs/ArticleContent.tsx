import { Calendar, Clock, Tag } from 'lucide-react';
import { Article } from '@/types';
import { formatDate } from '@/utils/date';
import CategoryBadge from './CategoryBadge';
import Badge from '@/components/ui/Badge';

interface ArticleContentProps {
  article: Article;
}

export default function ArticleContent({ article }: ArticleContentProps) {
  // Split content into paragraphs
  const paragraphs = article.content.split('\n\n');

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CategoryBadge category={article.category} />
          {article.subcategory && (
            <Badge variant="neutral" size="sm">
              {article.subcategory}
            </Badge>
          )}
        </div>

        <h1 className="text-4xl font-bold text-textPrimary mb-4 leading-tight">
          {article.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-textMuted">
          <div className="flex items-center gap-1.5">
            <Calendar size={16} />
            <span>{formatDate(article.date, 'MMMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={16} />
            <span>{article.readTime} min read</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag size={16} />
            <span className="capitalize">{article.importance} importance</span>
          </div>
        </div>
      </div>

      {/* Excerpt */}
      <div className="mb-8 p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
        <p className="text-lg text-textSecondary leading-relaxed italic">
          {article.excerpt}
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-invert max-w-none">
        {paragraphs.map((paragraph, index) => {
          // Check if paragraph is a heading (starts with ###)
          if (paragraph.startsWith('###')) {
            return (
              <h3 key={index} className="text-2xl font-bold text-textPrimary mt-8 mb-4">
                {paragraph.replace('###', '').trim()}
              </h3>
            );
          }

          // Check if paragraph is a list item (starts with • or -)
          if (paragraph.includes('•') || paragraph.startsWith('-')) {
            const items = paragraph.split('\n').filter(item => item.trim());
            return (
              <ul key={index} className="list-disc list-inside space-y-2 my-4 text-textSecondary">
                {items.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    {item.replace(/^[•\-]\s*/, '')}
                  </li>
                ))}
              </ul>
            );
          }

          // Regular paragraph
          return (
            <p key={index} className="text-textSecondary leading-relaxed mb-4">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="mt-12 pt-6 border-t border-border">
          <h4 className="text-sm font-medium text-textMuted mb-3">Tags:</h4>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <Badge key={index} variant="neutral" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
