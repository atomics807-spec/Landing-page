'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Image as ImageIcon, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { FormField } from '../components/table-components';

interface Property {
  id: string;
  title: string;
  description: string;
  property_type: string;
  status: string;
  price: number;
  location: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area_sqm: number;
  features: string[];
  images: string[];
  is_featured: boolean;
  is_active: boolean;
}

const statusOptions = [
  { value: 'available', label: 'Available', color: 'bg-green-100 text-green-800' },
  { value: 'booked', label: 'Booked', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'sold', label: 'Sold', color: 'bg-red-100 text-red-800' },
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '', description: '', property_type: 'residential', status: 'available',
    price: '', location: '', address: '', bedrooms: '', bathrooms: '', area_sqm: '',
    features: '', is_featured: false,
  });

  useEffect(() => { fetchProperties(); }, []);

  const fetchProperties = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
    setProperties(data || []);
    setIsLoading(false);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const { error } = await supabase.storage.from('images').upload(`properties/${fileName}`, file);
    if (error) return null;
    const { data } = supabase.storage.from('images').getPublicUrl(`properties/${fileName}`);
    return data.publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages: string[] = [];
    const newPreviews: string[] = [];

    for (const file of Array.from(files)) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase
      const url = await uploadImage(file);
      if (url) {
        newImages.push(url);
        newPreviews.push(url);
      }
    }

    setUploadedImages(prev => [...prev, ...newImages]);
    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const supabase = createClient();
    const data = {
      title: formData.title,
      description: formData.description,
      property_type: formData.property_type,
      status: formData.status,
      price: parseFloat(formData.price) || 0,
      location: formData.location,
      address: formData.address,
      bedrooms: parseInt(formData.bedrooms) || 0,
      bathrooms: parseInt(formData.bathrooms) || 0,
      area_sqm: parseFloat(formData.area_sqm) || 0,
      features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(Boolean) : [],
      images: uploadedImages,
      is_featured: formData.is_featured,
      is_active: true,
    };
    
    if (editingProperty) {
      await supabase.from('properties').update(data).eq('id', editingProperty.id);
    } else {
      await supabase.from('properties').insert(data);
    }
    
    setShowModal(false);
    setEditingProperty(null);
    resetForm();
    fetchProperties();
    setIsSaving(false);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', property_type: 'residential', status: 'available',
      price: '', location: '', address: '', bedrooms: '', bathrooms: '', area_sqm: '',
      features: '', is_featured: false });
    setUploadedImages([]);
    setImagePreviews([]);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title, description: property.description || '', property_type: property.property_type,
      status: property.status, price: property.price?.toString() || '', location: property.location,
      address: property.address || '', bedrooms: property.bedrooms?.toString() || '',
      bathrooms: property.bathrooms?.toString() || '', area_sqm: property.area_sqm?.toString() || '',
      features: property.features?.join(', ') || '', is_featured: property.is_featured,
    });
    setUploadedImages(property.images || []);
    setImagePreviews(property.images || []);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    const supabase = createClient();
    await supabase.from('properties').delete().eq('id', id);
    fetchProperties();
  };

  const handleToggleActive = async (property: Property) => {
    const supabase = createClient();
    await supabase.from('properties').update({ is_active: !property.is_active }).eq('id', property.id);
    fetchProperties();
  };

  const handleToggleFeatured = async (property: Property) => {
    const supabase = createClient();
    await supabase.from('properties').update({ is_featured: !property.is_featured }).eq('id', property.id);
    fetchProperties();
  };

  const handleStatusChange = async (property: Property, newStatus: string) => {
    const supabase = createClient();
    await supabase.from('properties').update({ status: newStatus }).eq('id', property.id);
    fetchProperties();
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Properties</h1>
        <Button onClick={() => { resetForm(); setEditingProperty(null); setShowModal(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Property
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {properties.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4">
                    {p.images?.[0] ? <img src={p.images[0]} alt={p.title} className="w-16 h-12 object-cover rounded" /> :
                      <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center"><ImageIcon className="h-4 w-4 text-gray-400" /></div>}
                  </td>
                  <td className="px-6 py-4 font-medium">{p.title}</td>
                  <td className="px-6 py-4"><Badge variant="secondary">{p.property_type}</Badge></td>
                  <td className="px-6 py-4">${p.price?.toLocaleString() || 'N/A'}</td>
                  <td className="px-6 py-4">{p.location}</td>
                  <td className="px-6 py-4">
                    <select value={p.status} onChange={(e) => handleStatusChange(p, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${statusOptions.find(s => s.value === p.status)?.color || 'bg-gray-100'}`}>
                      {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" onClick={() => handleToggleFeatured(p)} className={p.is_featured ? 'text-yellow-500' : ''}>
                      <Star className={`h-4 w-4 ${p.is_featured ? 'fill-yellow-500' : ''}`} />
                    </Button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleToggleActive(p)}>
                        {p.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(p)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {properties.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500">No properties found. Click "Add Property" to create one.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingProperty ? 'Edit Property' : 'Add Property'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* Image Upload Section */}
              <FormField label="Property Images">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-20 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-center">
                    <input
                      type="file"
                      id="property-images"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="property-images" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload images</p>
                    </label>
                  </div>
                  {isUploading && <p className="text-sm text-primary-600 mt-2 text-center">Uploading...</p>}
                </div>
              </FormField>

              <FormField label="Title" required>
                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Type">
                  <select value={formData.property_type} onChange={(e) => setFormData({...formData, property_type: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700">
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </FormField>
                <FormField label="Status">
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700">
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="sold">Sold</option>
                  </select>
                </FormField>
              </div>
              <FormField label="Price (USD)" required>
                <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Location" required>
                  <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                </FormField>
                <FormField label="Address">
                  <Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </FormField>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField label="Bedrooms"><Input type="number" value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: e.target.value})} /></FormField>
                <FormField label="Bathrooms"><Input type="number" value={formData.bathrooms} onChange={(e) => setFormData({...formData, bathrooms: e.target.value})} /></FormField>
                <FormField label="Area (sqm)"><Input type="number" value={formData.area_sqm} onChange={(e) => setFormData({...formData, area_sqm: e.target.value})} /></FormField>
              </div>
              <FormField label="Description"><Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} /></FormField>
              <FormField label="Features (comma separated)">
                <Input value={formData.features} onChange={(e) => setFormData({...formData, features: e.target.value})} placeholder="Pool, Garden, Garage" />
              </FormField>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} className="w-4 h-4" />
                <Label htmlFor="featured" className="cursor-pointer">Mark as Featured</Label>
              </div>
            </div>
            <div className="p-6 border-t flex gap-4">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving || !formData.title} className="flex-1">{isSaving ? 'Saving...' : 'Save'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
