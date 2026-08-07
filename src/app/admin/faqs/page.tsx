'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, X, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

interface FAQ {
  id: string;
  question: string;
  question_en: string;
  question_fr: string;
  answer: string;
  answer_en: string;
  answer_fr: string;
  category: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export default function FAQsPage() {
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    question_en: '',
    question_fr: '',
    answer: '',
    answer_en: '',
    answer_fr: '',
    category: '',
    sort_order: '0',
  });
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFAQs();
  }, []);

  async function fetchFAQs() {
    const supabase = createClient();
    const { data } = await supabase
      .from('faqs')
      .select('*')
      .order('sort_order', { ascending: true });

    if (data) {
      setFAQs(data as FAQ[]);
    }
    setLoading(false);
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = createClient();

      const faqData = {
        question: formData.question || formData.question_en,
        question_en: formData.question_en || formData.question,
        question_fr: formData.question_fr,
        answer: formData.answer || formData.answer_en,
        answer_en: formData.answer_en || formData.answer,
        answer_fr: formData.answer_fr,
        category: formData.category || null,
        sort_order: parseInt(formData.sort_order) || 0,
        is_active: true,
      };

      if (editingFaq) {
        await supabase.from('faqs').update(faqData).eq('id', editingFaq.id);
      } else {
        await supabase.from('faqs').insert(faqData);
      }

      await fetchFAQs();
      setShowModal(false);
      setEditingFaq(null);
      setFormData({
        question: '',
        question_en: '',
        question_fr: '',
        answer: '',
        answer_en: '',
        answer_fr: '',
        category: '',
        sort_order: '0',
      });
    } catch (error) {
      console.error('Error saving FAQ:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question || faq.question_en || '',
      question_en: faq.question_en || faq.question || '',
      question_fr: faq.question_fr || '',
      answer: faq.answer || faq.answer_en || '',
      answer_en: faq.answer_en || faq.answer || '',
      answer_fr: faq.answer_fr || '',
      category: faq.category || '',
      sort_order: faq.sort_order?.toString() || '0',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    const supabase = createClient();
    await supabase.from('faqs').delete().eq('id', id);
    await fetchFAQs();
  };

  const handleToggle = async (faq: FAQ) => {
    const supabase = createClient();
    await supabase.from('faqs').update({ is_active: !faq.is_active }).eq('id', faq.id);
    await fetchFAQs();
  };

  const filteredFAQs = faqs.filter(faq =>
    (faq.question || faq.question_en || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (faq.answer || faq.answer_en || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FAQs</h1>
          <p className="text-sm text-gray-500 mt-1">Manage frequently asked questions</p>
        </div>
        <Button onClick={() => {
          setEditingFaq(null);
          setFormData({
            question: '',
            question_en: '',
            question_fr: '',
            answer: '',
            answer_en: '',
            answer_fr: '',
            category: '',
            sort_order: '0',
          });
          setShowModal(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Add FAQ
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No FAQs found. Click "Add FAQ" to create one.
          </div>
        ) : (
          filteredFAQs.map((faq) => (
            <div key={faq.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{faq.category || 'General'}</Badge>
                    <Badge variant={faq.is_active ? 'default' : 'secondary'}>
                      {faq.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{faq.question_en || faq.question}</h3>
                  {faq.question_fr && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">FR: {faq.question_fr}</p>
                  )}
                  <p className="text-gray-600 dark:text-gray-300 mt-2">{faq.answer_en || faq.answer}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="ghost" size="sm" onClick={() => handleToggle(faq)}>
                    {faq.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(faq)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(faq.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full my-8">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <Label>Question (English) *</Label>
                <Input
                  value={formData.question_en}
                  onChange={(e) => setFormData({ ...formData, question_en: e.target.value })}
                  placeholder="e.g., What services does Paraysco offer?"
                />
              </div>
              <div>
                <Label>Question (French)</Label>
                <Input
                  value={formData.question_fr}
                  onChange={(e) => setFormData({ ...formData, question_fr: e.target.value })}
                  placeholder="Question en français..."
                />
              </div>
              <div>
                <Label>Answer (English) *</Label>
                <Textarea
                  value={formData.answer_en}
                  onChange={(e) => setFormData({ ...formData, answer_en: e.target.value })}
                  placeholder="Provide a clear, concise answer..."
                  rows={4}
                />
              </div>
              <div>
                <Label>Answer (French)</Label>
                <Textarea
                  value={formData.answer_fr}
                  onChange={(e) => setFormData({ ...formData, answer_fr: e.target.value })}
                  placeholder="Réponse en français..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., General, Services"
                  />
                </div>
                <div>
                  <Label>Sort Order</Label>
                  <Input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex gap-4">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} disabled={saving || !formData.question_en || !formData.answer_en} className="flex-1">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {editingFaq ? 'Update FAQ' : 'Save FAQ'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
