'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, X, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

interface Testimonial {
  id: string;
  name: string;
  company: string;
  content: string;
  rating: number;
  image_url: string;
  is_active: boolean;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', company: '', content: '', rating: '5', image_url: ''
  });

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    setTestimonials(data || []);
    setIsLoading(false);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const { error } = await supabase.storage.from('images').upload(`testimonials/${fileName}`, file);
    if (error) return null;
    const { data } = supabase.storage.from('images').getPublicUrl(`testimonials/${fileName}`);
    return data.publicUrl;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setIsUploading(true);
    const url = await uploadImage(file);
    if (url) setFormData({ ...formData, image_url: url });
    setIsUploading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const supabase = createClient();
    const data = {
      name: formData.name,
      company: formData.company || null,
      content: formData.content,
      rating: parseInt(formData.rating) || 5,
      image_url: formData.image_url || null,
      is_active: true,
    };
    if (editingId) {
      await supabase.from('testimonials').update(data).eq('id', editingId);
    } else {
      await supabase.from('testimonials').insert(data);
    }
    setShowModal(false);
    resetForm();
    fetchTestimonials();
    setIsSaving(false);
  };

  const handleEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setFormData({ name: t.name, company: t.company || '', content: t.content, rating: t.rating.toString(), image_url: t.image_url || '' });
    setImagePreview(t.image_url);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', company: '', content: '', rating: '5', image_url: '' });
    setEditingId(null);
    setImagePreview(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    const supabase = createClient();
    await supabase.from('testimonials').delete().eq('id', id);
    fetchTestimonials();
  };

  const handleToggle = async (t: Testimonial) => {
    const supabase = createClient();
    await supabase.from('testimonials').update({ is_active: !t.is_active }).eq('id', t.id);
    fetchTestimonials();
  };

  if (isLoading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Testimonials</h1>
        <Button onClick={() => { resetForm(); setShowModal(true); }}><Plus className="mr-2 h-4 w-4" /> Add Testimonial</Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {testimonials.map((t) => (
              <tr key={t.id}>
                <td className="px-6 py-4">
                  {t.image_url ? (
                    <img src={t.image_url} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-medium">{t.name}</td>
                <td className="px-6 py-4">{t.company || '-'}</td>
                <td className="px-6 py-4 max-w-xs truncate">{t.content}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4"><Badge variant={t.is_active ? 'default' : 'secondary'}>{t.is_active ? 'Active' : 'Inactive'}</Badge></td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(t)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleToggle(t)}>{t.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {testimonials.length === 0 && <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">No testimonials. Click "Add Testimonial" to create one.</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label>Profile Image (Optional)</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-full object-cover mx-auto" />
                      <button onClick={() => { setImagePreview(null); setFormData({ ...formData, image_url: '' }); }}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <>
                      <input type="file" id="testimonial-image" onChange={handleImageChange} accept="image/*" className="hidden" />
                      <label htmlFor="testimonial-image" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload image</p>
                      </label>
                    </>
                  )}
                  {isUploading && <p className="text-sm text-primary-600 mt-2">Uploading...</p>}
                </div>
              </div>
              <div><Label>Name *</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="John Smith" /></div>
              <div><Label>Company</Label><Input value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} placeholder="Tech Corp" /></div>
              <div><Label>Content *</Label><Textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} placeholder="Testimonial content..." /></div>
              <div><Label>Rating</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button key={r} type="button" onClick={() => setFormData({...formData, rating: r.toString()})}>
                      <Star className={`h-6 w-6 ${r <= parseInt(formData.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex gap-4">
              <Button variant="outline" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving || !formData.name || !formData.content} className="flex-1">
                {isSaving ? 'Saving...' : (editingId ? 'Update' : 'Save')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
