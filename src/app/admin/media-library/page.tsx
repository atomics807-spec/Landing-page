'use client';

import { useState } from 'react';
import { Upload, Trash2, Image as ImageIcon, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockImages = [
  { id: '1', url: 'https://picsum.photos/200', name: 'hero-image.jpg', size: '1.2 MB', type: 'image/jpeg' },
  { id: '2', url: 'https://picsum.photos/201', name: 'team-photo.jpg', size: '890 KB', type: 'image/jpeg' },
  { id: '3', url: 'https://picsum.photos/202', name: 'office.jpg', size: '2.1 MB', type: 'image/jpeg' },
];

export default function MediaLibraryPage() {
  const [images, setImages] = useState(mockImages);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this image?')) return;
    setImages(images.filter(i => i.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Media Library</h1>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500">Drop files here or click to upload</p>
          <input type="file" multiple accept="image/*" className="hidden" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <div className="aspect-square bg-gray-100 dark:bg-gray-700">
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium truncate">{img.name}</p>
              <p className="text-xs text-gray-500">{img.size}</p>
              <div className="flex items-center gap-2 mt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleCopyUrl(img.id, img.url)}>
                  {copiedId === img.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(img.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
