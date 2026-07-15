'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

interface Consultant {
  id: string;
  name: string;
  title: string;
  specialization: string;
  bio: string;
  image_url: string;
  email: string;
  phone: string;
  linkedin_url: string;
  is_active: boolean;
}

export default function ConsultantsPage() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', title: '', specialization: '', bio: '', email: '', phone: '', linkedin_url: '' });

  useEffect(() => { fetchConsultants(); }, []);

  const fetchConsultants = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('consultants').select('*').order('sort_order', { ascending: true });
    setConsultants(data || []);
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const supabase = createClient();
    await supabase.from('consultants').insert({
      ...formData, is_active: true, sort_order: 0,
    });
    setShowModal(false);
    setFormData({ name: '', title: '', specialization: '', bio: '', email: '', phone: '', linkedin_url: '' });
    fetchConsultants();
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this consultant?')) return;
    const supabase = createClient();
    await supabase.from('consultants').delete().eq('id', id);
    fetchConsultants();
  };

  const handleToggle = async (consultant: Consultant) => {
    const supabase = createClient();
    await supabase.from('consultants').update({ is_active: !consultant.is_active }).eq('id', consultant.id);
    fetchConsultants();
  };

  if (isLoading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Consultants</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="mr-2 h-4 w-4" /> Add Consultant</Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {consultants.map((c) => (
              <tr key={c.id}>
                <td className="px-6 py-4">
                  {c.image_url ? <img src={c.image_url} alt={c.name} className="w-12 h-12 rounded-full object-cover" /> :
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center"><ImageIcon className="h-4 w-4" /></div>}
                </td>
                <td className="px-6 py-4 font-medium">{c.name}</td>
                <td className="px-6 py-4">{c.title}</td>
                <td className="px-6 py-4">{c.specialization}</td>
                <td className="px-6 py-4"><Badge variant={c.is_active ? 'default' : 'secondary'}>{c.is_active ? 'Active' : 'Inactive'}</Badge></td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleToggle(c)}>{c.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {consultants.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No consultants. Click "Add Consultant" to create one.</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Add Consultant</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Name *</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                <div><Label>Title *</Label><Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} /></div>
              </div>
              <div><Label>Specialization *</Label><Input value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} /></div>
              <div><Label>Bio</Label><Textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
                <div><Label>Phone</Label><Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
              </div>
              <div><Label>LinkedIn URL</Label><Input value={formData.linkedin_url} onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})} /></div>
            </div>
            <div className="p-6 border-t flex gap-4">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving} className="flex-1">{isSaving ? 'Saving...' : 'Save'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
