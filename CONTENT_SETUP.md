# Content Curation System - Setup Guide

## What We've Built

A **hybrid content curation system** that:

1. **Discovers** articles from The Hindu & other sources via RSS feeds
2. **Allows your team** to write CLAT-focused summaries (legal!)
3. **Adds quiz questions** for each article
4. **Publishes** to the student-facing platform

This approach is **100% legal** and adds significant value to raw news.

## Quick Start

### 1. Access Admin Dashboard

```bash
# Start the dev server
npm run dev

# Navigate to admin dashboard
http://localhost:3000/admin
```

### 2. Discover Articles

1. Admin dashboard shows RSS feeds from The Hindu
2. Browse latest articles from different categories
3. Click "Curate" on relevant articles

### 3. Write CLAT-Focused Content

For each article:
- **Original summary** (500-1500 words)
- **Legal analysis** and CLAT connections
- **5 quiz questions** with explanations
- **Proper source attribution**

## System Architecture

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  THE HINDU RSS FEEDS (Public & Legal)           │
│  • National News                                │
│  • Business News                                │
│  • Science & Tech                               │
│  • Opinion                                      │
│                                                 │
└────────────────┬────────────────────────────────┘
                 │
                 │ Fetch headlines & excerpts
                 ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  ADMIN DASHBOARD (/admin)                       │
│  • Discover articles                            │
│  • View recent headlines                        │
│  • Filter by category                           │
│  • Click "Curate" to start                      │
│                                                 │
└────────────────┬────────────────────────────────┘
                 │
                 │ Your team writes
                 ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  CONTENT EDITOR                                 │
│  • Write original CLAT-focused summary          │
│  • Add legal analysis                           │
│  • Create 5 quiz questions                      │
│  • Add source attribution                       │
│  • Submit for review                            │
│                                                 │
└────────────────┬────────────────────────────────┘
                 │
                 │ After review
                 ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  PUBLISHED TO STUDENT APP                       │
│  • /current-affairs                             │
│  • Students can read, bookmark, take quiz       │
│  • Original content with source link            │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Files Created

### RSS Feed Integration
- `utils/rss-feeds.ts` - RSS feed configurations
- `app/api/admin/rss/route.ts` - Server-side RSS fetcher (avoids CORS)

### Admin Panel
- `app/admin/page.tsx` - Main admin dashboard
- `app/admin/layout.tsx` - Admin layout
- `types/admin.ts` - Admin types and interfaces

### Documentation
- `CONTENT_CURATION_GUIDE.md` - Complete curation workflow
- `CONTENT_SETUP.md` - This file

## RSS Feeds Available

### The Hindu (Public RSS - Legal to use)
```typescript
const HINDU_RSS_FEEDS = [
  {
    name: 'National News',
    url: 'https://www.thehindu.com/news/national/feeder/default.rss',
  },
  {
    name: 'Business',
    url: 'https://www.thehindu.com/business/feeder/default.rss',
  },
  {
    name: 'Opinion',
    url: 'https://www.thehindu.com/opinion/feeder/default.rss',
  },
  {
    name: 'Science',
    url: 'https://www.thehindu.com/sci-tech/science/feeder/default.rss',
  },
];
```

### PIB (Government - Public Domain)
```typescript
const PIB_RSS_FEEDS = [
  {
    name: 'Cabinet',
    url: 'https://pib.gov.in/RSS/RSSFeeds.aspx?MinCode=27',
  },
  {
    name: 'Law & Justice',
    url: 'https://pib.gov.in/RSS/RSSFeeds.aspx?MinCode=34',
  },
];
```

## Next Steps for Full Implementation

### Phase 1: Core Curation (Week 1-2)

1. **Build Article Editor**
   ```bash
   # Create article editor page
   /admin/editor/new
   /admin/editor/[id]
   ```

2. **Add Quiz Builder**
   - Interface to create 5 MCQs
   - Explanation field for each question
   - Preview functionality

3. **Implement Review Workflow**
   - Submit for review
   - Reviewer approves/rejects
   - Feedback system

### Phase 2: Content Management (Week 3-4)

1. **Article List View**
   ```
   /admin/articles
   - List all curated articles
   - Filter by status, category, curator
   - Edit/delete functionality
   ```

2. **Team Management**
   ```
   /admin/team
   - Add curators/reviewers
   - Assign categories
   - Track productivity
   ```

3. **Analytics Dashboard**
   ```
   /admin/analytics
   - Articles published per day/week
   - Curator performance
   - Student engagement (views, quiz attempts)
   ```

### Phase 3: Advanced Features (Week 5-6)

1. **Automated Suggestions**
   - Keyword matching for CLAT relevance
   - Auto-categorization
   - Similar article detection

2. **Batch Operations**
   - Import multiple articles
   - Bulk category changes
   - Schedule publishing

3. **Quality Assurance**
   - Plagiarism check
   - Readability score
   - CLAT relevance score

## Legal Compliance Checklist

✅ **We're Compliant Because:**

1. **No Full Text Copying**
   - We write original summaries
   - Add substantial educational content
   - Transform news into CLAT prep material

2. **Source Attribution**
   - Always link to original article
   - Credit The Hindu prominently
   - Drive traffic to their site (benefits them)

3. **Fair Use Doctrine**
   - Educational purpose (non-commercial copying)
   - Transformative use (adding analysis)
   - Limited excerpts only
   - No market harm (we're not competing with The Hindu)

4. **RSS Feeds are Public**
   - The Hindu provides these publicly
   - RSS exists for content discovery
   - We use headlines (factual, not copyrightable)

## Team Roles

### Content Curator
- Discovers relevant articles
- Writes CLAT-focused summaries
- Creates quiz questions
- Target: 5-7 articles/week

### Reviewer
- Reviews curated content
- Checks legal compliance
- Verifies CLAT relevance
- Approves for publishing

### Admin
- Manages team
- Monitors quality
- Handles technical issues
- Reviews analytics

## Scaling Plan

### Month 1-2: Build Foundation
- 10-15 articles/week (2-3 curators)
- Focus on quality
- Establish workflows

### Month 3-4: Scale Content
- 30-40 articles/week (5-6 curators)
- Cover all categories
- Daily publishing schedule

### Month 5-6: Optimize
- 50+ articles/week (8-10 curators)
- Automated workflows
- Advanced analytics
- Student feedback loop

## Cost Estimation

### Content Team (Monthly)
- 5 Curators × ₹30,000 = ₹1,50,000
- 2 Reviewers × ₹40,000 = ₹80,000
- 1 Editor-in-Chief × ₹60,000 = ₹60,000
- **Total: ₹2,90,000/month**

### Alternative: Freelancers
- Per article rate: ₹500-1000
- Target 200 articles/month
- **Total: ₹1,00,000-2,00,000/month**

## Support Resources

### For Curators
- Content guide: `CONTENT_CURATION_GUIDE.md`
- Admin dashboard: `/admin`
- Editor tutorial: Coming soon

### For Reviewers
- Review checklist: In guide
- Quality standards: In guide
- Approval workflow: Coming soon

### For Admins
- System architecture: This document
- Team management: Coming soon
- Analytics: Coming soon

## Getting Help

**Technical Issues:**
- Check dev server is running
- Clear browser cache
- Check console for errors

**Content Questions:**
- Refer to curation guide
- Ask senior curator
- Consult legal team if unsure

**Workflow Issues:**
- Document the problem
- Suggest improvements
- Discuss in team meeting

---

**You now have a legal, scalable content curation system!**

Next step: Build the article editor UI and start curating your first article.
