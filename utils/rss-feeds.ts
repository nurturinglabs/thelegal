/**
 * RSS Feed Configuration for The Hindu and other sources
 * These feeds are used to discover relevant current affairs articles
 */

export interface RSSFeed {
  name: string;
  url: string;
  category: string;
  active: boolean;
}

// The Hindu RSS Feeds (Publicly available)
export const HINDU_RSS_FEEDS: RSSFeed[] = [
  {
    name: 'The Hindu - National',
    url: 'https://www.thehindu.com/news/national/feeder/default.rss',
    category: 'Legal & Constitutional',
    active: true,
  },
  {
    name: 'The Hindu - Business',
    url: 'https://www.thehindu.com/business/feeder/default.rss',
    category: 'Economy & Business',
    active: true,
  },
  {
    name: 'The Hindu - Opinion',
    url: 'https://www.thehindu.com/opinion/feeder/default.rss',
    category: 'Legal & Constitutional',
    active: true,
  },
  {
    name: 'The Hindu - Science',
    url: 'https://www.thehindu.com/sci-tech/science/feeder/default.rss',
    category: 'Science & Technology',
    active: true,
  },
  {
    name: 'The Hindu - Environment',
    url: 'https://www.thehindu.com/sci-tech/energy-and-environment/feeder/default.rss',
    category: 'Environment & Climate',
    active: true,
  },
  {
    name: 'The Hindu - Education',
    url: 'https://www.thehindu.com/news/national/feeder/default.rss',
    category: 'Social Issues',
    active: true,
  },
];

// PIB (Press Information Bureau) - Government press releases
export const PIB_RSS_FEEDS: RSSFeed[] = [
  {
    name: 'PIB - Cabinet',
    url: 'https://pib.gov.in/RSS/RSSFeeds.aspx?MinCode=27',
    category: 'Politics & Governance',
    active: true,
  },
  {
    name: 'PIB - Law & Justice',
    url: 'https://pib.gov.in/RSS/RSSFeeds.aspx?MinCode=34',
    category: 'Legal & Constitutional',
    active: true,
  },
];

export const ALL_RSS_FEEDS = [...HINDU_RSS_FEEDS, ...PIB_RSS_FEEDS];

// RSS Feed Item Interface (what we get from RSS feeds)
export interface RSSFeedItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
  source: string;
}

/**
 * Parse RSS feed (client-side using a CORS proxy or server-side)
 * Note: You'll need to implement actual RSS parsing
 * This is a placeholder for the structure
 */
export async function fetchRSSFeed(feedUrl: string): Promise<RSSFeedItem[]> {
  // TODO: Implement actual RSS fetching
  // Options:
  // 1. Server-side API route that fetches RSS
  // 2. Use a library like 'rss-parser' on the server
  // 3. Use a CORS proxy for client-side fetching (not recommended for production)

  console.log(`Fetching RSS feed: ${feedUrl}`);
  return [];
}

/**
 * Filter RSS items for CLAT relevance
 */
export function filterForCLATRelevance(items: RSSFeedItem[]): RSSFeedItem[] {
  const clatKeywords = [
    // Legal & Constitutional
    'supreme court', 'high court', 'constitution', 'amendment', 'judgment',
    'legal', 'law', 'article', 'fundamental rights', 'directive principles',

    // Current Affairs
    'parliament', 'election', 'government', 'policy', 'bill', 'act',
    'international', 'treaty', 'agreement', 'diplomacy',

    // Economy
    'economy', 'gdp', 'inflation', 'rbi', 'budget', 'fiscal',
    'monetary policy', 'trade', 'export', 'import',

    // Social Issues
    'education', 'health', 'environment', 'climate', 'social',
    'welfare', 'scheme', 'rights', 'justice',

    // Science & Technology
    'isro', 'space', 'technology', 'innovation', 'research',
  ];

  return items.filter(item => {
    const text = `${item.title} ${item.description}`.toLowerCase();
    return clatKeywords.some(keyword => text.includes(keyword));
  });
}
