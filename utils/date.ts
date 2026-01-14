import { format, formatDistanceToNow, parseISO, isAfter, subDays } from 'date-fns';

export function formatDate(date: string | Date, formatStr: string = 'MMM dd, yyyy'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

export function formatRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Unknown time';
  }
}

export function isWithinDays(date: string | Date, days: number): boolean {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const cutoffDate = subDays(new Date(), days);
    return isAfter(dateObj, cutoffDate);
  } catch (error) {
    console.error('Error checking date range:', error);
    return false;
  }
}

export function getCurrentDate(): string {
  return new Date().toISOString();
}
