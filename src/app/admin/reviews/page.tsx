'use client';

import { useState, useEffect } from 'react';
import { Check, X, Star, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

interface Review {
  id: string;
  name: string;
  company: string;
  content: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setReviews(data as Review[]);
    }
    setLoading(false);
  }

  const handleApprove = async (review: Review) => {
    setProcessing(review.id);
    const supabase = createClient();
    await supabase.from('reviews').update({ is_approved: true }).eq('id', review.id);
    await fetchReviews();
    setProcessing(null);
  };

  const handleReject = async (review: Review) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    setProcessing(review.id);
    const supabase = createClient();
    await supabase.from('reviews').delete().eq('id', review.id);
    await fetchReviews();
    setProcessing(null);
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'pending') return matchesSearch && !review.is_approved;
    if (filter === 'approved') return matchesSearch && review.is_approved;
    return matchesSearch;
  });

  const pendingCount = reviews.filter(r => !r.is_approved).length;
  const approvedCount = reviews.filter(r => r.is_approved).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pendingCount} pending • {approvedCount} approved
          </p>
        </div>
        
        <div className="flex gap-2">
          {(['all', 'pending', 'approved'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'pending' && pendingCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search reviews..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-80 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredReviews.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No reviews found
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{review.name}</h3>
                      {review.company && (
                        <span className="text-sm text-gray-500">from {review.company}</span>
                      )}
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">&quot;{review.content}&quot;</p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!review.is_approved ? (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApprove(review)}
                          disabled={processing === review.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {processing === review.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(review)}
                          disabled={processing === review.id}
                          className="text-red-600 hover:bg-red-50"
                        >
                          {processing === review.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <X className="h-4 w-4 mr-1" />
                              Delete
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approved
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReject(review)}
                          disabled={processing === review.id}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
