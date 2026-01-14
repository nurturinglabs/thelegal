'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Building2,
  BookOpen,
  Briefcase,
  Network,
  Lightbulb,
  Info,
  Target,
  Star
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Progress from '@/components/ui/Progress';
import { cn } from '@/utils/cn';
import collegesData from '@/data/colleges.json';

interface College {
  rank: number;
  id: string;
  name: string;
  shortName: string;
  location: string;
  established: number;
  seats: number;
  totalScore: number;
  scores: {
    academicReputation: number;
    facultyQuality: number;
    placements: number;
    infrastructure: number;
    research: number;
    alumniNetwork: number;
    industryConnect: number;
  };
  highlights: string[];
  avgPackage: string;
  topRecruiters: string[];
  cutoff2024: string;
  website: string;
}

const scoreLabels: Record<keyof College['scores'], { label: string; icon: typeof GraduationCap }> = {
  academicReputation: { label: 'Academic Reputation', icon: GraduationCap },
  facultyQuality: { label: 'Faculty Quality', icon: BookOpen },
  placements: { label: 'Placements', icon: Briefcase },
  infrastructure: { label: 'Infrastructure', icon: Building2 },
  research: { label: 'Research', icon: Lightbulb },
  alumniNetwork: { label: 'Alumni Network', icon: Network },
  industryConnect: { label: 'Industry Connect', icon: TrendingUp },
};

function CollegeCard({ college, isExpanded, onToggle }: {
  college: College;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500 to-amber-600';
    if (rank === 2) return 'from-gray-300 to-gray-400';
    if (rank === 3) return 'from-amber-600 to-orange-700';
    return 'from-primary to-accent';
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { variant: 'warning' as const, label: 'Top Choice' };
    if (rank <= 3) return { variant: 'success' as const, label: 'Tier 1' };
    if (rank <= 5) return { variant: 'info' as const, label: 'Tier 2' };
    return { variant: 'neutral' as const, label: 'Tier 3' };
  };

  const badge = getRankBadge(college.rank);

  return (
    <Card className={cn(
      'transition-all duration-300',
      isExpanded ? 'ring-2 ring-primary/50' : 'hover:border-primary/30'
    )}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Rank Badge */}
        <div className={cn(
          'flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-2xl shadow-lg',
          getRankColor(college.rank)
        )}>
          #{college.rank}
        </div>

        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-textPrimary">{college.shortName}</h3>
            <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
          </div>
          <p className="text-sm text-textSecondary mb-2">{college.name}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-textMuted">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {college.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              Est. {college.established}
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} />
              {college.seats} seats
            </span>
          </div>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold text-primary">{college.totalScore}</div>
          <div className="text-xs text-textMuted">Score</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border">
        <div className="text-center p-2 rounded-lg bg-surfaceLight">
          <p className="text-lg font-semibold text-textPrimary">{college.avgPackage}</p>
          <p className="text-xs text-textMuted">Avg Package</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-surfaceLight">
          <p className="text-lg font-semibold text-textPrimary">{college.cutoff2024}</p>
          <p className="text-xs text-textMuted">Cutoff 2024</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-surfaceLight">
          <p className="text-lg font-semibold text-textPrimary">{college.seats}</p>
          <p className="text-xs text-textMuted">Total Seats</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-surfaceLight">
          <p className="text-lg font-semibold text-textPrimary">{new Date().getFullYear() - college.established}+</p>
          <p className="text-xs text-textMuted">Years Legacy</p>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary hover:text-primaryDark transition-colors"
      >
        {isExpanded ? (
          <>
            <span>Show Less</span>
            <ChevronUp size={18} />
          </>
        ) : (
          <>
            <span>View Details</span>
            <ChevronDown size={18} />
          </>
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border space-y-6 animate-slide-down">
          {/* Score Breakdown */}
          <div>
            <h4 className="text-sm font-medium text-textMuted mb-3">Score Breakdown</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(college.scores).map(([key, value]) => {
                const scoreKey = key as keyof College['scores'];
                const { label, icon: Icon } = scoreLabels[scoreKey];
                return (
                  <div key={key} className="flex items-center gap-3">
                    <Icon size={16} className="text-textMuted flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-textSecondary">{label}</span>
                        <span className="text-textPrimary font-medium">{value}/100</span>
                      </div>
                      <Progress value={value} max={100} size="sm" color="primary" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <h4 className="text-sm font-medium text-textMuted mb-3">Why Choose {college.shortName}?</h4>
            <ul className="space-y-2">
              {college.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-textSecondary">
                  <Star size={14} className="text-warning mt-0.5 flex-shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Recruiters */}
          <div>
            <h4 className="text-sm font-medium text-textMuted mb-3">Top Recruiters</h4>
            <div className="flex flex-wrap gap-2">
              {college.topRecruiters.map((recruiter) => (
                <span
                  key={recruiter}
                  className="px-3 py-1 rounded-full bg-surfaceLight text-sm text-textSecondary"
                >
                  {recruiter}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <a
            href={college.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Button variant="outline" icon={<ExternalLink size={16} />} iconPosition="right">
              Visit Official Website
            </Button>
          </a>
        </div>
      )}
    </Card>
  );
}

export default function EndGoalClient() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showMethodology, setShowMethodology] = useState(false);

  const colleges = collegesData.colleges as College[];
  const methodology = collegesData.rankingMethodology;

  return (
    <div className="container mx-auto p-6 space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-surface to-accent/20 p-8 md:p-12">
        <div className="absolute top-4 right-4 text-8xl opacity-10">
          <Trophy />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
              <Target size={24} className="text-primary" />
            </div>
            <Badge variant="warning" size="sm">Your Mission</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
            Top 10 National Law Universities
          </h1>
          <p className="text-lg text-textSecondary max-w-2xl">
            Your CLAT score determines which of India&apos;s premier law schools you can attend.
            Here are the top 10 NLUs ranked by comprehensive analysis - your ultimate end goals.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/practice">
              <Button variant="primary">Start Practicing</Button>
            </Link>
            <Button
              variant="outline"
              icon={<Info size={16} />}
              onClick={() => setShowMethodology(!showMethodology)}
            >
              {showMethodology ? 'Hide' : 'View'} Ranking Methodology
            </Button>
          </div>
        </div>
      </div>

      {/* Methodology Section */}
      {showMethodology && (
        <Card className="animate-slide-down">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Info size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-textPrimary">{methodology.title}</h2>
              <p className="text-sm text-textMuted mt-1">{methodology.description}</p>
            </div>
          </div>

          {/* Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {methodology.parameters.map((param) => (
              <div
                key={param.name}
                className="p-4 rounded-lg bg-surfaceLight border border-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-textPrimary">{param.name}</h4>
                  <Badge variant="info" size="sm">{param.weight}%</Badge>
                </div>
                <p className="text-sm text-textMuted">{param.description}</p>
              </div>
            ))}
          </div>

          {/* Sources */}
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-textMuted mb-2">Data Sources</h4>
            <div className="flex flex-wrap gap-2">
              {methodology.sources.map((source) => (
                <span
                  key={source}
                  className="px-2 py-1 text-xs rounded bg-surface text-textSecondary"
                >
                  {source}
                </span>
              ))}
            </div>
            <p className="text-xs text-textMuted mt-4 italic">
              {methodology.disclaimer}
            </p>
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <GraduationCap size={24} className="mx-auto text-primary mb-2" />
          <p className="text-2xl font-bold text-textPrimary">24</p>
          <p className="text-sm text-textMuted">NLUs in India</p>
        </Card>
        <Card className="text-center">
          <Users size={24} className="mx-auto text-accent mb-2" />
          <p className="text-2xl font-bold text-textPrimary">~3000</p>
          <p className="text-sm text-textMuted">Top 10 Seats</p>
        </Card>
        <Card className="text-center">
          <Briefcase size={24} className="mx-auto text-success mb-2" />
          <p className="text-2xl font-bold text-textPrimary">95%+</p>
          <p className="text-sm text-textMuted">Placement Rate</p>
        </Card>
        <Card className="text-center">
          <TrendingUp size={24} className="mx-auto text-warning mb-2" />
          <p className="text-2xl font-bold text-textPrimary">₹15L+</p>
          <p className="text-sm text-textMuted">Avg Package</p>
        </Card>
      </div>

      {/* College Rankings */}
      <div>
        <h2 className="text-2xl font-bold text-textPrimary mb-6 flex items-center gap-3">
          <Trophy size={28} className="text-warning" />
          The Rankings
        </h2>
        <div className="space-y-4">
          {colleges.map((college) => (
            <CollegeCard
              key={college.id}
              college={college}
              isExpanded={expandedId === college.id}
              onToggle={() => setExpandedId(expandedId === college.id ? null : college.id)}
            />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
        <div className="text-center py-4">
          <h3 className="text-xl font-bold text-textPrimary mb-2">
            Ready to Achieve Your Dream NLU?
          </h3>
          <p className="text-textSecondary mb-6 max-w-lg mx-auto">
            Start your CLAT preparation today. Every question you practice brings you closer to your goal.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/practice">
              <Button variant="primary" icon={<Target size={18} />}>
                Start Practice
              </Button>
            </Link>
            <Link href="/tests">
              <Button variant="outline" icon={<GraduationCap size={18} />}>
                Take Mock Test
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
