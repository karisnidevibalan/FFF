import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Eye, 
  Download, 
  Share2, 
  TrendingUp, 
  Calendar,
  Clock,
  Globe,
  Users,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface AnalyticsData {
  totalViews: number;
  totalDownloads: number;
  totalShares: number;
  viewsChange: number;
  downloadsChange: number;
  viewsByDay: Array<{ date: string; views: number }>;
  viewsByLocation: Array<{ country: string; views: number; percentage: number }>;
  viewsBySource: Array<{ source: string; views: number; percentage: number }>;
  avgTimeOnPage: string;
  bounceRate: number;
}

interface ResumeAnalyticsProps {
  resumeId: string;
  className?: string;
}

const ResumeAnalytics: React.FC<ResumeAnalyticsProps> = ({ resumeId, className = '' }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [resumeId, timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // In production, fetch from API:
      // const response = await fetch(`/api/resume/analytics/${resumeId}?range=${timeRange}`);
      // const data = await response.json();
      
      // Demo data
      const demoData: AnalyticsData = {
        totalViews: 1247,
        totalDownloads: 89,
        totalShares: 34,
        viewsChange: 23.5,
        downloadsChange: -5.2,
        viewsByDay: [
          { date: '2026-01-15', views: 45 },
          { date: '2026-01-16', views: 52 },
          { date: '2026-01-17', views: 38 },
          { date: '2026-01-18', views: 67 },
          { date: '2026-01-19', views: 71 },
          { date: '2026-01-20', views: 49 },
          { date: '2026-01-21', views: 58 },
        ],
        viewsByLocation: [
          { country: 'United States', views: 523, percentage: 42 },
          { country: 'India', views: 312, percentage: 25 },
          { country: 'United Kingdom', views: 156, percentage: 12.5 },
          { country: 'Canada', views: 124, percentage: 10 },
          { country: 'Others', views: 132, percentage: 10.5 },
        ],
        viewsBySource: [
          { source: 'LinkedIn', views: 456, percentage: 36.5 },
          { source: 'Direct Link', views: 389, percentage: 31.2 },
          { source: 'Email', views: 234, percentage: 18.8 },
          { source: 'Other', views: 168, percentage: 13.5 },
        ],
        avgTimeOnPage: '2m 34s',
        bounceRate: 32.5,
      };

      setAnalytics(demoData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-32 bg-muted/50" />
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  const maxViews = Math.max(...analytics.viewsByDay.map(d => d.views));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Time Range Selector */}
      <div className="flex gap-2">
        {(['7d', '30d', '90d'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              timeRange === range
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-5 h-5 text-blue-500" />
                <Badge 
                  variant={analytics.viewsChange >= 0 ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {analytics.viewsChange >= 0 ? (
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(analytics.viewsChange)}%
                </Badge>
              </div>
              <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Download className="w-5 h-5 text-green-500" />
                <Badge 
                  variant={analytics.downloadsChange >= 0 ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {analytics.downloadsChange >= 0 ? (
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(analytics.downloadsChange)}%
                </Badge>
              </div>
              <p className="text-2xl font-bold">{analytics.totalDownloads}</p>
              <p className="text-sm text-muted-foreground">Downloads</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <Share2 className="w-5 h-5 text-purple-500 mb-2" />
              <p className="text-2xl font-bold">{analytics.totalShares}</p>
              <p className="text-sm text-muted-foreground">Shares</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <Clock className="w-5 h-5 text-orange-500 mb-2" />
              <p className="text-2xl font-bold">{analytics.avgTimeOnPage}</p>
              <p className="text-sm text-muted-foreground">Avg. Time</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Views Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-5 h-5 text-primary" />
            Views Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-1 h-32">
            {analytics.viewsByDay.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ height: 0 }}
                animate={{ height: `${(day.views / maxViews) * 100}%` }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t-sm relative group cursor-pointer"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {day.views} views
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            {analytics.viewsByDay.map((day) => (
              <span key={day.date}>
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location & Source Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Views by Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="w-5 h-5 text-primary" />
              Views by Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.viewsByLocation.map((loc, index) => (
              <motion.div
                key={loc.country}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between text-sm mb-1">
                  <span>{loc.country}</span>
                  <span className="text-muted-foreground">{loc.views} ({loc.percentage}%)</span>
                </div>
                <Progress value={loc.percentage} className="h-2" />
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Views by Source */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="w-5 h-5 text-primary" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.viewsBySource.map((source, index) => (
              <motion.div
                key={source.source}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between text-sm mb-1">
                  <span>{source.source}</span>
                  <span className="text-muted-foreground">{source.views} ({source.percentage}%)</span>
                </div>
                <Progress value={source.percentage} className="h-2" />
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Engagement Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Engagement Metrics</CardTitle>
          <CardDescription>How recruiters interact with your resume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-3xl font-bold text-green-500">
                {(100 - analytics.bounceRate).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Engagement Rate</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-3xl font-bold text-blue-500">
                {((analytics.totalDownloads / analytics.totalViews) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Download Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeAnalytics;
