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
  answer: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  is_active: boolean;
  created_at: string;
}

export default function FAQsPage() {
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    meta_title: '',
    meta_description: '',
    keywords: '',
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
      .order('created_at', { ascending: false });

    if (data) {
      setFAQs(data as FAQ[]);
    }
    setLoading(false);
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = createClient();

      // Auto-generate SEO fields if empty
      const seoTitle = formData.meta_title || formData.question;
      const seoDescription = formData.meta_description || formData.answer.substring(0, 160);

      const faqData = {
        question: formData.question,
        answer: formData.answer,
        meta_title: seoTitle,
        meta_description: seoDescription,
        keywords: formData.keywords || generateKeywords(formData.question, formData.answer),
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
      setFormData({ question: '', answer: '', meta_title: '', meta_description: '', keywords: '' });
    } catch (error) {
      console.error('Error saving FAQ:', error);
    } finally {
      setSaving(false);
    }
  };

  const generateKeywords = (question: string, answer: string): string => {
    const text = `${question} ${answer} Paraysco Consulting Cameroon real estate services`;
    const words = text.toLowerCase().split(/\s+/);
    const uniqueWords = [...new Set(words.filter(w => w.length > 3))];
    return uniqueWords.slice(0, 10).join(', ');
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      meta_title: faq.meta_title || '',
      meta_description: faq.meta_description || '',
      keywords: faq.keywords || '',
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
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
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
          <p className="text-sm text-gray-500 mt-1">SEO-optimized FAQs for search engines</p>
        </div>
        <Button onClick={() => { setEditingFaq(null); setFormData({ question: '', answer: '', meta_title: '', meta_description: '', keywords: '' }); setShowModal(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add FAQ
        </Button>
      </div>

      {/* SEO Tips Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">SEO Best Practices for FAQs</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Use natural language questions that users search for</li>
          <li>• Keep answers concise (40-60 words) for featured snippets</li>
          <li>• Include relevant keywords naturally in questions and answers</li>
          <li>• Add location-specific terms like "Cameroon" or "Limbe" when relevant</li>
        </ul>
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
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">{faq.answer}</p>

                  {/* SEO Preview */}
                  {faq.meta_title && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">SEO Preview:</p>
                      <p className="text-sm text-primary-600">{faq.meta_title}</p>
                      <p className="text-xs text-gray-500 mt-1">{faq.meta_description?.substring(0, 100)}...</p>
                      {faq.keywords && (
                        <p className="text-xs text-gray-400 mt-1">Keywords: {faq.keywords}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant={faq.is_active ? 'default' : 'secondary'}>
                    {faq.is_active ? 'Active' : 'Inactive'}
                  </Badge>
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
                <Label>Question *</Label>
                <Input
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g., What services does Paraysco offer?"
                />
                <p className="text-xs text-gray-500 mt-1">Use natural language that users would search for</p>
              </div>
              <div>
                <Label>Answer *</Label>
                <Textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Provide a clear, concise answer..."
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">Aim for 40-60 words for better chance of featured snippets</p>
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">SEO Settings (Optional)</h4>
                <div className="space-y-4">
                  <div>
                    <Label>Meta Title</Label>
                    <Input
                      value={formData.meta_title}
                      onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                      placeholder="Auto-generated from question if empty"
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
                  </div>
                  <div>
                    <Label>Meta Description</Label>
                    <Textarea
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      placeholder="Auto-generated from answer if empty"
                      rows={2}
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
                  </div>
                  <div>
                    <Label>Keywords</Label>
                    <Input
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      placeholder="paraysco, real estate, cameroon, limbe..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Comma-separated keywords for search optimization</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex gap-4">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} disabled={saving || !formData.question || !formData.answer} className="flex-1">
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
