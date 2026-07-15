'use client';

import { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const mockFAQs = [
  { id: '1', question: 'What services do you offer?', answer: 'We offer real estate, engineering, and consulting services.', is_active: true },
  { id: '2', question: 'How can I contact you?', answer: 'You can contact us through our contact form or email.', is_active: true },
];

export default function FAQsPage() {
  const [faqs, setFAQs] = useState(mockFAQs);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ question: '', answer: '' });

  const handleSave = () => {
    setFAQs([...faqs, { id: Date.now().toString(), ...formData, is_active: true }]);
    setShowModal(false);
    setFormData({ question: '', answer: '' });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    setFAQs(faqs.filter(f => f.id !== id));
  };

  const handleToggle = (id: string) => {
    setFAQs(faqs.map(f => f.id === id ? { ...f, is_active: !f.is_active } : f));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FAQs</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="mr-2 h-4 w-4" /> Add FAQ</Button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{faq.answer}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Badge variant={faq.is_active ? 'default' : 'secondary'}>{faq.is_active ? 'Active' : 'Inactive'}</Badge>
                <Button variant="ghost" size="sm" onClick={() => handleToggle(faq.id)}>{faq.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(faq.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Add FAQ</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><Label>Question *</Label><Input value={formData.question} onChange={(e) => setFormData({...formData, question: e.target.value})} /></div>
              <div><Label>Answer *</Label><Textarea value={formData.answer} onChange={(e) => setFormData({...formData, answer: e.target.value})} rows={4} /></div>
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
