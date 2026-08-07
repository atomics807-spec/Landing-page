'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Eye, EyeOff, X, Image as ImageIcon, Loader2, Upload } from 'lucide-react';
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
  image_url: string;
  category: string;
  is_published: boolean;
  published_at: string;
  author_name: string;
  created_at: string;
}

export default function BlogPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Newsletter | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    cover_image: '',
    author_name: 'Paraysco Team',
    is_published: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchNewsletters(); }, []);

  const fetchNewsletters = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('newsletters').select('*').order('created_at', { ascending: false });
    setNewsletters(data || []);
    setIsLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const supabase = createClient();
      const fileName = `blog-${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('Failed to upload image');
        return;
      }

      const { data } = supabase.storage.from('images').getPublicUrl(fileName);
      setFormData({ ...formData, cover_image: data.publicUrl });
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const supabase = createClient();
    const slug = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const postData = {
      title: formData.title,
      slug: editingPost?.slug || slug,
      excerpt: formData.excerpt,
      content: formData.content,
      category: formData.category,
      cover_image: formData.cover_image,
      image_url: formData.cover_image,
      author_name: formData.author_name || 'Paraysco Team',
      is_published: formData.is_published,
      published_at: formData.is_published ? new Date().toISOString() : null,
    };

    if (editingPost) {
      await supabase.from('newsletters').update(postData).eq('id', editingPost.id);
    } else {
      await supabase.from('newsletters').insert(postData);
    }

    setShowModal(false);
    setEditingPost(null);
    setFormData({ title: '', excerpt: '', content: '', category: '', cover_image: '', author_name: 'Paraysco Team', is_published: false });
    fetchNewsletters();
    setIsSaving(false);
  };

  const handleEdit = (post: Newsletter) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content,
      category: post.category || '',
      cover_image: post.cover_image || post.image_url || '',
      author_name: post.author_name || 'Paraysco Team',
      is_published: post.is_published
    });
    setShowModal(true);
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

  const openCreateModal = () => {
    setEditingPost(null);
    setFormData({ title: '', excerpt: '', content: '', category: '', cover_image: '', author_name: 'Paraysco Team', is_published: false });
    setShowModal(true);
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog / Newsletters</h1>
        <Button onClick={openCreateModal}><Plus className="mr-2 h-4 w-4" /> Create Post</Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {newsletters.map((n) => (
              <tr key={n.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4">
                  {n.cover_image || n.image_url ? (
                    <img src={n.cover_image || n.image_url} alt={n.title} className="w-16 h-12 object-cover rounded-lg" />
                  ) : (
                    <div className="w-16 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-medium">{n.title}</td>
                <td className="px-6 py-4">{n.category || 'N/A'}</td>
                <td className="px-6 py-4"><Badge variant={n.is_published ? 'default' : 'secondary'}>{n.is_published ? 'Published' : 'Draft'}</Badge></td>
                <td className="px-6 py-4">{new Date(n.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(n)}>Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleTogglePublish(n)}>{n.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(n.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {newsletters.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No posts. Click "Create Post" to create one.</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingPost ? 'Edit Post' : 'Create Post'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <Label>Cover Image</Label>
                <div className="mt-2">
                  {formData.cover_image ? (
                    <div className="relative inline-block">
                      <img src={formData.cover_image} alt="Cover" className="w-full h-48 object-cover rounded-lg" />
                      <button
                        onClick={() => setFormData({ ...formData, cover_image: '' })}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
                    >
                      {isUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600" />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Click to upload image</p>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div><Label>Title *</Label><Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Post title" /></div>
              <div><Label>Category</Label><Input value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="Insights, News, Guide" /></div>
              <div><Label>Author Name</Label><Input value={formData.author_name} onChange={(e) => setFormData({...formData, author_name: e.target.value})} placeholder="Paraysco Team" /></div>
              <div><Label>Excerpt</Label><Textarea value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} rows={2} placeholder="Brief description for listings" /></div>
              <div><Label>Content *</Label><Textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={10} placeholder="Full article content..." /></div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="publish" checked={formData.is_published} onChange={(e) => setFormData({...formData, is_published: e.target.checked})} className="w-4 h-4" />
                <Label htmlFor="publish" className="cursor-pointer">Publish immediately</Label>
              </div>
            </div>
            <div className="p-6 border-t flex gap-4">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving || !formData.title || !formData.content} className="flex-1">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {editingPost ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
