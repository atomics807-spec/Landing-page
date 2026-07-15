'use client';

import { useState, useEffect } from 'react';
import { Trash2, Mail, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

export default function NewsletterSubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchSubscribers(); }, []);

  const fetchSubscribers = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false });
    setSubscribers(data || []);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this subscriber?')) return;
    const supabase = createClient();
    await supabase.from('newsletter_subscribers').delete().eq('id', id);
    fetchSubscribers();
  };

  const exportCSV = () => {
    const csv = 'Email,Subscribed,Status\n' + subscribers.map(s => `${s.email},${s.subscribed_at},${s.is_active ? 'Active' : 'Inactive'}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
  };

  if (isLoading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Newsletter Subscribers</h1>
        <Button variant="outline" onClick={exportCSV}><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscribed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {subscribers.map((s) => (
              <tr key={s.id}>
                <td className="px-6 py-4 flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /> {s.email}</td>
                <td className="px-6 py-4">{new Date(s.subscribed_at).toLocaleDateString()}</td>
                <td className="px-6 py-4"><Badge variant={s.is_active ? 'default' : 'secondary'}>{s.is_active ? 'Active' : 'Unsubscribed'}</Badge></td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">No subscribers</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
