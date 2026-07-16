'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, X, Upload, User, AlertCircle } from 'lucide-react';
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', position: '', bio: '', linkedin_url: '', twitter_url: '', sort_order: '0', image_url: ''
  });

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('team_members').select('*').order('sort_order', { ascending: true });
    setMembers(data || []);
    setIsLoading(false);
  };

  const uploadImage = async (file: File): Promise<{ url: string | null; error: string | null }> => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (!fileExt || !allowedExts.includes(fileExt)) {
      return { url: null, error: 'Invalid file type. Please use JPG, PNG, GIF, or WebP.' };
    }
    
    if (file.size > 5 * 1024 * 1024) {
      return { url: null, error: 'File too large. Maximum size is 5MB.' };
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(`team/${fileName}`, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return { url: null, error: `Upload failed: ${uploadError.message}` };
      }

      const { data: urlData } = supabase.storage.from('images').getPublicUrl(`team/${fileName}`);
      return { url: urlData.publicUrl, error: null };
    } catch (err: any) {
      console.error('Upload exception:', err);
      return { url: null, error: err.message || 'Upload failed' };
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase
    setIsUploading(true);
    const result = await uploadImage(file);
    
    if (result.error) {
      setUploadError(result.error);
      setImagePreview(null);
    } else if (result.url) {
      setFormData(prev => ({ ...prev, image_url: result.url! }));
    }
    setIsUploading(false);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.position) return;
    
    setIsSaving(true);
    const supabase = createClient();
    
    const data = {
      name: formData.name,
      position: formData.position,
      bio: formData.bio || null,
      image_url: formData.image_url || null,
      linkedin_url: formData.linkedin_url || null,
      twitter_url: formData.twitter_url || null,
      sort_order: parseInt(formData.sort_order) || 0,
      is_active: true,
    };

    if (editingId) {
      const { error } = await supabase.from('team_members').update(data).eq('id', editingId);
      if (error) alert('Failed to update: ' + error.message);
    } else {
      const { error } = await supabase.from('team_members').insert(data);
      if (error) alert('Failed to create: ' + error.message);
    }
    
    setShowModal(false);
    resetForm();
    fetchMembers();
    setIsSaving(false);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      position: member.position,
      bio: member.bio || '',
      linkedin_url: member.linkedin_url || '',
      twitter_url: member.twitter_url || '',
      sort_order: member.sort_order?.toString() || '0',
      image_url: member.image_url || ''
    });
    setImagePreview(member.image_url);
    setUploadError(null);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', position: '', bio: '', linkedin_url: '', twitter_url: '', sort_order: '0', image_url: '' });
    setEditingId(null);
    setImagePreview(null);
    setUploadError(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team member?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) alert('Failed to delete: ' + error.message);
    fetchMembers();
  };

  const handleToggle = async (member: TeamMember) => {
    const supabase = createClient();
    const { error } = await supabase.from('team_members').update({ is_active: !member.is_active }).eq('id', member.id);
    if (error) alert('Failed to update status: ' + error.message);
    fetchMembers();
  };

  if (isLoading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Members</h1>
        <Button onClick={() => { resetForm(); setShowModal(true); }}><Plus className="mr-2 h-4 w-4" /> Add Member</Button>
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
                  {m.image_url ? (
                    <img src={m.image_url} alt={m.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-medium">{m.name}</td>
                <td className="px-6 py-4">{m.position}</td>
                <td className="px-6 py-4"><Badge variant={m.is_active ? 'default' : 'secondary'}>{m.is_active ? 'Active' : 'Inactive'}</Badge></td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(m)}><Edit className="h-4 w-4" /></Button>
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
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Team Member' : 'Add Team Member'}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <Label>Profile Image (Optional)</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover mx-auto" />
                      <button onClick={() => { setImagePreview(null); setFormData(prev => ({ ...prev, image_url: '' })); }}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <input type="file" id="team-image" onChange={handleImageChange} accept="image/*" className="hidden" />
                      <label htmlFor="team-image" className="cursor-pointer block">
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload image</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, WebP (max 5MB)</p>
                      </label>
                    </>
                  )}
                  {isUploading && <p className="text-sm text-primary-600 mt-2 flex items-center justify-center gap-2"><div className="animate-spin h-4 w-4 border-2 border-primary-600 border-t-transparent rounded-full" /> Uploading...</p>}
                  {uploadError && (
                    <div className="mt-2 p-2 bg-red-50 text-red-600 rounded-lg text-sm flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div><Label>Name *</Label><Input value={formData.name} onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))} placeholder="John Doe" /></div>
              <div><Label>Position *</Label><Input value={formData.position} onChange={(e) => setFormData(prev => ({...prev, position: e.target.value}))} placeholder="CEO" /></div>
              <div><Label>Bio</Label><Textarea value={formData.bio} onChange={(e) => setFormData(prev => ({...prev, bio: e.target.value}))} placeholder="Short biography..." /></div>
              <div><Label>LinkedIn URL</Label><Input type="url" value={formData.linkedin_url} onChange={(e) => setFormData(prev => ({...prev, linkedin_url: e.target.value}))} placeholder="https://linkedin.com/in/..." /></div>
              <div><Label>Twitter URL</Label><Input type="url" value={formData.twitter_url} onChange={(e) => setFormData(prev => ({...prev, twitter_url: e.target.value}))} placeholder="https://twitter.com/..." /></div>
              <div><Label>Sort Order</Label><Input type="number" value={formData.sort_order} onChange={(e) => setFormData(prev => ({...prev, sort_order: e.target.value}))} /></div>
            </div>
            <div className="p-6 border-t flex gap-4">
              <Button variant="outline" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving || !formData.name || !formData.position} className="flex-1">
                {isSaving ? 'Saving...' : (editingId ? 'Update' : 'Save')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
