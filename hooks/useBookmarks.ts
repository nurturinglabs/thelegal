'use client';

import { useLocalStorage } from './useLocalStorage';
import { Bookmarks } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';
import { getCurrentDate } from '@/utils/date';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmarks>(
    STORAGE_KEYS.BOOKMARKS,
    {
      articles: [],
      questions: [],
      lastUpdated: getCurrentDate(),
    }
  );

  const toggleArticleBookmark = (articleId: string) => {
    setBookmarks((prev) => ({
      ...prev,
      articles: prev.articles.includes(articleId)
        ? prev.articles.filter((id) => id !== articleId)
        : [...prev.articles, articleId],
      lastUpdated: getCurrentDate(),
    }));
  };

  const toggleQuestionBookmark = (questionId: string) => {
    setBookmarks((prev) => ({
      ...prev,
      questions: prev.questions.includes(questionId)
        ? prev.questions.filter((id) => id !== questionId)
        : [...prev.questions, questionId],
      lastUpdated: getCurrentDate(),
    }));
  };

  const isArticleBookmarked = (articleId: string): boolean => {
    return bookmarks.articles.includes(articleId);
  };

  const isQuestionBookmarked = (questionId: string): boolean => {
    return bookmarks.questions.includes(questionId);
  };

  const clearArticleBookmarks = () => {
    setBookmarks((prev) => ({
      ...prev,
      articles: [],
      lastUpdated: getCurrentDate(),
    }));
  };

  const clearQuestionBookmarks = () => {
    setBookmarks((prev) => ({
      ...prev,
      questions: [],
      lastUpdated: getCurrentDate(),
    }));
  };

  return {
    bookmarkedArticles: bookmarks.articles,
    bookmarkedQuestions: bookmarks.questions,
    toggleArticleBookmark,
    toggleQuestionBookmark,
    isArticleBookmarked,
    isQuestionBookmarked,
    clearArticleBookmarks,
    clearQuestionBookmarks,
  };
}
