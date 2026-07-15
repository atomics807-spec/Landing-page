'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', description: '', icon: '', image_url: '', sort_order: '0'
  });

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
    setServices(data || []);
    setIsLoading(false);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const { error } = await supabase.storage.from('images').upload(`services/${fileName}`, file);
    if (error) return null;
    const { data } = supabase.storage.from('images').getPublicUrl(`services/${fileName}`);
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
      description: formData.description || null,
      icon: formData.icon || null,
      image_url: formData.image_url || null,
      sort_order: parseInt(formData.sort_order) || 0,
      is_active: true,
    };
    if (editingId) {
      await supabase.from('services').update(data).eq('id', editingId);
    } else {
      await supabase.from('services').insert(data);
    }
    setShowModal(false);
    resetForm();
    fetchServices();
    setIsSaving(false);
  };

  const handleEdit = (s: Service) => {
    setEditingId(s.id);
    setFormData({ name: s.name, description: s.description || '', icon: s.icon || '', image_url: s.image_url || '', sort_order: s.sort_order?.toString() || '0' });
    setImagePreview(s.image_url);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', icon: '', image_url: '', sort_order: '0' });
    setEditingId(null);
    setImagePreview(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    const supabase = createClient();
    await supabase.from('services').delete().eq('id', id);
    fetchServices();
  };

  const handleToggle = async (s: Service) => {
    const supabase = createClient();
    await supabase.from('services').update({ is_active: !s.is_active }).eq('id', s.id);
    fetchServices();
  };

  if (isLoading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Services</h1>
        <Button onClick={() => { resetForm(); setShowModal(true); }}><Plus className="mr-2 h-4 w-4" /> Add Service</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div key={s.id} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            {s.image_url && (
              <div className="aspect-video bg-gray-100 dark:bg-gray-700">
                <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{s.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{s.description || 'No description'}</p>
                  <Badge variant={s.is_active ? 'default' : 'secondary'} className="mt-2">{s.is_active ? 'Active' : 'Inactive'}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => handleEdit(s)} className="flex-1"><Edit className="h-4 w-4 mr-1" /> Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">No services. Click "Add Service" to create one.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label>Image (Optional)</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img src={imagePreview} alt="Preview" className="w-32 h-20 object-cover rounded-lg mx-auto" />
                      <button onClick={() => { setImagePreview(null); setFormData({ ...formData, image_url: '' }); }}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <>
                      <input type="file" id="service-image" onChange={handleImageChange} accept="image/*" className="hidden" />
                      <label htmlFor="service-image" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload image</p>
                      </label>
                    </>
                  )}
                  {isUploading && <p className="text-sm text-primary-600 mt-2">Uploading...</p>}
                </div>
              </div>
              <div><Label>Service Name *</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Real Estate Advisory" /></div>
              <div><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Service description..." /></div>
              <div><Label>Icon Name</Label><Input value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} placeholder="building, cog, chart (lucide icon)" /></div>
              <div><Label>Sort Order</Label><Input type="number" value={formData.sort_order} onChange={(e) => setFormData({...formData, sort_order: e.target.value})} /></div>
            </div>
            <div className="p-6 border-t flex gap-4">
              <Button variant="outline" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving || !formData.name} className="flex-1">{isSaving ? 'Saving...' : (editingId ? 'Update' : 'Save')}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
