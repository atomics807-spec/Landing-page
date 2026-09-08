'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, Building2, Mail, FileText, Briefcase, Images, Star, Check, X, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

interface Review {
  id: string;
  name: string;
  company: string | null;
  content: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({});
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [processingReview, setProcessingReview] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
    fetchReviews();
  }, []);

  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    setReviews(data || []);
    setReviewsLoading(false);
  }, []);

  const handleApprove = async (id: string) => {
    setProcessingReview(id);
    const supabase = createClient();
    await supabase.from('reviews').update({ is_approved: true }).eq('id', id);
    await fetchReviews();
    setProcessingReview(null);
  };

  const handleReject = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    setProcessingReview(id);
    const supabase = createClient();
    await supabase.from('reviews').delete().eq('id', id);
    await fetchReviews();
    setProcessingReview(null);
  };

  const fetchStats = async () => {
    const supabase = createClient();
    const tables = ['users', 'properties', 'newsletter_subscribers', 'newsletters', 'team_members', 'consultants', 'gallery_images'];
    const results: any = {};
    
    for (const table of tables) {
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      results[table] = count || 0;
    }
    setStats(results);
  };

  const statCards = [
    { label: 'Users', count: stats.users, icon: Users, color: 'blue' },
    { label: 'Properties', count: stats.properties, icon: Building2, color: 'green' },
    { label: 'Subscribers', count: stats.newsletter_subscribers, icon: Mail, color: 'purple' },
    { label: 'Newsletters', count: stats.newsletters, icon: FileText, color: 'orange' },
    { label: 'Team Members', count: stats.team_members, icon: Users, color: 'indigo' },
    { label: 'Consultants', count: stats.consultants, icon: Briefcase, color: 'pink' },
    { label: 'Gallery', count: stats.gallery_images, icon: Images, color: 'teal' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.count}</p>
                </div>
                <stat.icon className={`h-10 w-10 text-${stat.color}-500`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Reviews */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pending Reviews</h2>
          <Badge variant="secondary">{reviews.filter((r) => !r.is_approved).length} pending</Badge>
        </div>
        {reviewsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : reviews.filter((r) => !r.is_approved).length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-gray-500">No pending reviews.</CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {reviews.filter((r) => !r.is_approved).map((review) => (
              <Card key={review.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 dark:text-white">{review.name}</p>
                        {review.company && <span className="text-sm text-gray-500">· {review.company}</span>}
                        <span className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: review.rating }, (_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{review.content}</p>
                      <p className="mt-2 text-xs text-gray-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        disabled={processingReview === review.id}
                        onClick={() => void handleApprove(review.id)}
                      >
                        <Check className="h-4 w-4 mr-1" /> Accept
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={processingReview === review.id}
                        onClick={() => void handleReject(review.id)}
                      >
                        <X className="h-4 w-4 mr-1" /> Decline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
