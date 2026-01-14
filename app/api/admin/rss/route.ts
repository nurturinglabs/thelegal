/**
 * API Route: Fetch RSS Feeds
 * Server-side RSS fetching to avoid CORS issues
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const feedUrl = searchParams.get('url');

  if (!feedUrl) {
    return NextResponse.json(
      { error: 'Feed URL is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch the RSS feed
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VIDHIBot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }

    const xmlText = await response.text();

    // Parse XML (simple parser - you might want to use a library like 'fast-xml-parser')
    const items = parseRSSFeed(xmlText);

    return NextResponse.json({
      success: true,
      feedUrl,
      items,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch RSS feed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Simple RSS XML parser
 * For production, consider using 'fast-xml-parser' or 'rss-parser' npm packages
 */
interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
}

function parseRSSFeed(xmlText: string) {
  const items: RSSItem[] = [];

  try {
    // Extract items using regex (basic approach)
    const itemMatches = Array.from(xmlText.matchAll(/<item>([\s\S]*?)<\/item>/g));

    for (const match of itemMatches) {
      const itemXml = match[1];

      const title = extractTag(itemXml, 'title');
      const link = extractTag(itemXml, 'link');
      const description = extractTag(itemXml, 'description');
      const pubDate = extractTag(itemXml, 'pubDate');
      const guid = extractTag(itemXml, 'guid');

      items.push({
        title: cleanText(title),
        link: link.trim(),
        description: cleanText(description),
        pubDate: pubDate.trim(),
        guid: guid.trim() || link.trim(),
      });
    }
  } catch (error) {
    console.error('Error parsing RSS XML:', error);
  }

  return items;
}

function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 'is');
  const match = xml.match(regex);
  return match ? match[1] : '';
}

function cleanText(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1') // Remove CDATA
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}
