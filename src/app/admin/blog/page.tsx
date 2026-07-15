'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

interface Newsletter {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export default function BlogPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ title: '', excerpt: '', content: '', category: '', is_published: false });

  useEffect(() => { fetchNewsletters(); }, []);

  const fetchNewsletters = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('newsletters').select('*').order('created_at', { ascending: false });
    setNewsletters(data || []);
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const supabase = createClient();
    const slug = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    await supabase.from('newsletters').insert({
      title: formData.title, slug, excerpt: formData.excerpt, content: formData.content,
      category: formData.category, is_published: formData.is_published,
      published_at: formData.is_published ? new Date().toISOString() : null,
    });
    setShowModal(false);
    setFormData({ title: '', excerpt: '', content: '', category: '', is_published: false });
    fetchNewsletters();
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    const supabase = createClient();
    await supabase.from('newsletters').delete().eq('id', id);
    fetchNewsletters();
  };

  const handleTogglePublish = async (newsletter: Newsletter) => {
    const supabase = createClient();
    await supabase.from('newsletters').update({ 
      is_published: !newsletter.is_published,
      published_at: !newsletter.is_published ? new Date().toISOString() : null
    }).eq('id', newsletter.id);
    fetchNewsletters();
  };

  if (isLoading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog / Newsletters</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="mr-2 h-4 w-4" /> Create Post</Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {newsletters.map((n) => (
              <tr key={n.id}>
                <td className="px-6 py-4 font-medium">{n.title}</td>
                <td className="px-6 py-4">{n.category || 'N/A'}</td>
                <td className="px-6 py-4"><Badge variant={n.is_published ? 'default' : 'secondary'}>{n.is_published ? 'Published' : 'Draft'}</Badge></td>
                <td className="px-6 py-4">{new Date(n.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleTogglePublish(n)}>{n.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(n.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {newsletters.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No posts. Click "Create Post" to create one.</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Create Post</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><Label>Title *</Label><Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} /></div>
              <div><Label>Category</Label><Input value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="Insights, News, Guide" /></div>
              <div><Label>Excerpt</Label><Textarea value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} rows={2} /></div>
              <div><Label>Content *</Label><Textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={8} /></div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="publish" checked={formData.is_published} onChange={(e) => setFormData({...formData, is_published: e.target.checked})} className="w-4 h-4" />
                <Label htmlFor="publish" className="cursor-pointer">Publish immediately</Label>
              </div>
            </div>
            <div className="p-6 border-t flex gap-4">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving} className="flex-1">{isSaving ? 'Saving...' : 'Create'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
