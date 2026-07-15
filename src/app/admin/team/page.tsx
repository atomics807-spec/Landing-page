'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image_url: string;
  linkedin_url: string;
  twitter_url: string;
  is_active: boolean;
  sort_order: number;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', position: '', bio: '', linkedin_url: '', twitter_url: '', sort_order: '0' });

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('team_members').select('*').order('sort_order', { ascending: true });
    setMembers(data || []);
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const supabase = createClient();
    await supabase.from('team_members').insert({
      name: formData.name, position: formData.position, bio: formData.bio,
      linkedin_url: formData.linkedin_url, twitter_url: formData.twitter_url,
      sort_order: parseInt(formData.sort_order) || 0, is_active: true,
    });
    setShowModal(false);
    setFormData({ name: '', position: '', bio: '', linkedin_url: '', twitter_url: '', sort_order: '0' });
    fetchMembers();
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team member?')) return;
    const supabase = createClient();
    await supabase.from('team_members').delete().eq('id', id);
    fetchMembers();
  };

  const handleToggle = async (member: TeamMember) => {
    const supabase = createClient();
    await supabase.from('team_members').update({ is_active: !member.is_active }).eq('id', member.id);
    fetchMembers();
  };

  if (isLoading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Members</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="mr-2 h-4 w-4" /> Add Member</Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {members.map((m) => (
              <tr key={m.id}>
                <td className="px-6 py-4">
                  {m.image_url ? <img src={m.image_url} alt={m.name} className="w-12 h-12 rounded-full object-cover" /> :
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center"><ImageIcon className="h-4 w-4" /></div>}
                </td>
                <td className="px-6 py-4 font-medium">{m.name}</td>
                <td className="px-6 py-4">{m.position}</td>
                <td className="px-6 py-4"><Badge variant={m.is_active ? 'default' : 'secondary'}>{m.is_active ? 'Active' : 'Inactive'}</Badge></td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleToggle(m)}>{m.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(m.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {members.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No team members. Click "Add Member" to create one.</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Add Team Member</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><Label>Name *</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
              <div><Label>Position *</Label><Input value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} /></div>
              <div><Label>Bio</Label><Textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} /></div>
              <div><Label>LinkedIn URL</Label><Input value={formData.linkedin_url} onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})} /></div>
              <div><Label>Twitter URL</Label><Input value={formData.twitter_url} onChange={(e) => setFormData({...formData, twitter_url: e.target.value})} /></div>
              <div><Label>Sort Order</Label><Input type="number" value={formData.sort_order} onChange={(e) => setFormData({...formData, sort_order: e.target.value})} /></div>
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
