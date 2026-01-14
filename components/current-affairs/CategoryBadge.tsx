import Badge from '@/components/ui/Badge';
import { CACategory } from '@/utils/constants';

interface CategoryBadgeProps {
  category: CACategory;
  size?: 'sm' | 'md' | 'lg';
}

export default function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  const getCategoryVariant = (cat: CACategory): 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary' => {
    switch (cat) {
      case 'Legal & Constitutional':
        return 'primary';
      case 'International Relations':
        return 'info';
      case 'Economy & Business':
        return 'success';
      case 'Environment & Climate':
        return 'success';
      case 'Science & Technology':
        return 'info';
      case 'Social Issues':
        return 'warning';
      case 'Politics & Governance':
        return 'error';
      default:
        return 'neutral';
    }
  };

  if (category === 'All') {
    return null;
  }

  return (
    <Badge variant={getCategoryVariant(category)} size={size}>
      {category}
    </Badge>
  );
}
