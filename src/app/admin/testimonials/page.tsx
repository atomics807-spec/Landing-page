'use client';

import { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const mockTestimonials = [
  { id: '1', name: 'John Smith', company: 'Tech Corp', content: 'Excellent service!', rating: 5, is_active: true },
  { id: '2', name: 'Jane Doe', company: 'Finance Inc', content: 'Very professional team.', rating: 5, is_active: true },
];

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState(mockTestimonials);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', company: '', content: '', rating: '5' });

  const handleSave = () => {
    setTestimonials([...testimonials, { id: Date.now().toString(), ...formData, rating: parseInt(formData.rating), is_active: true }]);
    setShowModal(false);
    setFormData({ name: '', company: '', content: '', rating: '5' });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  const handleToggle = (id: string) => {
    setTestimonials(testimonials.map(t => t.id === id ? { ...t, is_active: !t.is_active } : t));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Testimonials</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="mr-2 h-4 w-4" /> Add Testimonial</Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
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
                <td className="px-6 py-4 font-medium">{t.name}</td>
                <td className="px-6 py-4">{t.company}</td>
                <td className="px-6 py-4 max-w-xs truncate">{t.content}</td>
                <td className="px-6 py-4"><div className="flex"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> x {t.rating}</div></td>
                <td className="px-6 py-4"><Badge variant={t.is_active ? 'default' : 'secondary'}>{t.is_active ? 'Active' : 'Inactive'}</Badge></td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleToggle(t.id)}>{t.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Add Testimonial</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><Label>Name *</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
              <div><Label>Company</Label><Input value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} /></div>
              <div><Label>Content *</Label><Textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} /></div>
              <div><Label>Rating</Label><Input type="number" min="1" max="5" value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} /></div>
            </div>
            <div className="p-6 border-t flex gap-4">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} className="flex-1">Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
