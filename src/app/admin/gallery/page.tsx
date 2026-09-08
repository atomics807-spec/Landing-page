'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Trash2, Pencil, ImagePlus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  sort_order: number;
}

const CATEGORIES = [
  { value: 'Flyer', label: 'Flyer' },
  { value: 'Event', label: 'Event' },
  { value: 'Project', label: 'Project' },
  { value: 'Company', label: 'Company' },
  { value: 'Other', label: 'Other' },
];

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Flyer',
    sortOrder: '',
    imageUrl: '',
  });

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    setImages(data || []);
    setIsLoading(false);
  }, []);

  useEffect(() => { void fetchImages(); }, [fetchImages]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    const supabase = createClient();
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!allowedExts.includes(fileExt)) {
      setIsUploading(false);
      return;
    }
    const unique = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const fileName = `${unique}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(`flyers/${fileName}`, file, { cacheControl: '3600', upsert: false });
    if (uploadError) {
      console.error('Upload error:', uploadError);
      setIsUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(`flyers/${fileName}`)
    setFormData((prev) => ({ ...prev, imageUrl: urlData.publicUrl }));
    setIsUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) return;
    setIsSaving(true);
    const supabase = createClient();
    if (editingId) {
      const { error } = await supabase
        .from('gallery_images')
        .update({ title: formData.title, description: formData.description, category: formData.category, sort_order: Number(formData.sortOrder) || 0, image_url: formData.imageUrl })
        .eq('id', editingId);
    } else {
      const { error } = await supabase
        .from('gallery_images')
        .insert([{ title: formData.title, description: formData.description, category: formData.category, sort_order: Number(formData.sortOrder) || 0, image_url: formData.imageUrl }]);
    }
    setIsSaving(false);
    setEditingId(null);
    setFormData({ title: '', description: '', category: 'Flyer', sortOrder: '' , imageUrl: '' });
    fetchImages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    const supabase = createClient();
    await supabase.from('gallery_images').delete().eq('id', id);
    fetchImages();
  };

  const startEdit = (img: GalleryImage) => {
    setEditingId(img.id);
    setFormData({ title: img.title, description: img.description || '', category: img.category, sortOrder: String(img.sort_order), imageUrl: img.image_url });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gallery</h1>
        <p className="text-muted-foreground">Manage gallery images, flyers, and events</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Image' : 'Add New Image'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gallery-title">Title</Label>
              <Input id="gallery-title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gallery-desc">Description</Label>
              <Textarea id="gallery-desc" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gallery-cat">Category</Label>
              <Select value={formData.category} onValueChange={(v) => handleInputChange('category', v)}>
                <SelectTrigger id="gallery-cat"><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gallery-sort">Sort Order</Label>
              <Input id="gallery-sort" type="number" value={formData.sortOrder} onChange={(e) => handleInputChange('sortOrder', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <div className="flex items-center gap-3">
                <Input type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleUpload(f); }} className="flex-1" />
                {isUploading && <Loader2 className="h-5 w-5 animate-spin text-primary-600" />}
              </div>
              {formData.imageUrl && (
                <div className="mt-2 flex items-center gap-3">
                  <ImagePlus className="h-5 w-5 text-primary-600" />
                  <span className="text-sm text-muted-foreground">Image uploaded</span>
                </div>
              )}
            </div>
            <Button type="submit" disabled={isSaving || !formData.imageUrl}>
              {isSaving ? 'Saving...' : editingId ? 'Update' : 'Add Image'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gallery Images</CardTitle>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <p className="text-muted-foreground">No images yet. Upload your first image above.</p>
          ) : (
            <ul className="divide-y">
              {images.map((img) => (
                <li key={img.id} className="flex items-center gap-4 py-3">
                  <img src={img.image_url} alt={img.title} className="h-16 w-24 rounded object-cover" />
                  <div className="flex-1">
                    <p className="font-medium">{img.title}</p>
                    <p className="text-sm text-muted-foreground">{img.category}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => startEdit(img)} aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => void handleDelete(img.id)} aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
