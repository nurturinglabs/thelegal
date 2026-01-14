'use client';

import { useState, useEffect } from 'react';
import { Plus, RefreshCw, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { ALL_RSS_FEEDS } from '@/utils/rss-feeds';
import Link from 'next/link';

interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
}

export default function AdminDashboard() {
  const [rssItems, setRssItems] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(ALL_RSS_FEEDS[0]);

  const fetchRSSFeed = async (feedUrl: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/rss?url=${encodeURIComponent(feedUrl)}`);
      const data = await response.json();

      if (data.success) {
        setRssItems(data.items.slice(0, 20)); // Show latest 20 items
      } else {
        console.error('Failed to fetch RSS feed:', data.error);
      }
    } catch (error) {
      console.error('Error fetching RSS feed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRSSFeed(selectedFeed.url);
  }, [selectedFeed]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary mb-2">
            Content Curation Dashboard
          </h1>
          <p className="text-textSecondary">
            Discover, curate, and publish CLAT-relevant current affairs articles
          </p>
        </div>
        <Link href="/admin/editor/new">
          <Button variant="primary" icon={<Plus size={18} />}>
            Create New Article
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="text-primary" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-textPrimary">18</div>
              <div className="text-xs text-textMuted">Published</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="text-warning" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-textPrimary">5</div>
              <div className="text-xs text-textMuted">In Progress</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <AlertCircle className="text-info" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-textPrimary">3</div>
              <div className="text-xs text-textMuted">In Review</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="text-success" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-textPrimary">12</div>
              <div className="text-xs text-textMuted">Discovered</div>
            </div>
          </div>
        </Card>
      </div>

      {/* RSS Feed Selector */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-textPrimary">Discover Articles from Sources</h2>
          <Button
            variant="outline"
            icon={<RefreshCw size={18} />}
            onClick={() => fetchRSSFeed(selectedFeed.url)}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>

        {/* Feed Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {ALL_RSS_FEEDS.map((feed) => (
            <button
              key={feed.url}
              onClick={() => setSelectedFeed(feed)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedFeed.url === feed.url
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-textSecondary hover:bg-surfaceLight'
              }`}
            >
              {feed.name}
            </button>
          ))}
        </div>

        {/* RSS Items */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-textMuted">Loading articles...</p>
          </div>
        ) : rssItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-textMuted">No articles found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rssItems.map((item) => (
              <div
                key={item.guid}
                className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-textPrimary mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-textSecondary mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <Badge variant="info" size="sm">
                        {selectedFeed.category}
                      </Badge>
                      <span className="text-xs text-textMuted">
                        {new Date(item.pubDate).toLocaleDateString()}
                      </span>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        View Original
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/editor/new?source=${encodeURIComponent(item.link)}`}>
                      <Button variant="outline" size="sm">
                        Curate
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Guide */}
      <Card className="p-6 bg-surfaceLight border-border">
        <h3 className="font-semibold text-textPrimary mb-3">Content Curation Workflow</h3>
        <ol className="space-y-2 text-sm text-textSecondary">
          <li>1. <strong>Discover:</strong> Browse RSS feeds from The Hindu and other sources</li>
          <li>2. <strong>Curate:</strong> Click &quot;Curate&quot; to write CLAT-focused summary with legal analysis</li>
          <li>3. <strong>Add Quiz:</strong> Create 5 multiple-choice questions for each article</li>
          <li>4. <strong>Review:</strong> Submit for review by senior team member</li>
          <li>5. <strong>Publish:</strong> Once approved, article goes live on the platform</li>
        </ol>
      </Card>
    </div>
  );
}
