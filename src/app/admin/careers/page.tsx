'use client';

import { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const mockCareers = [
  { id: '1', title: 'Senior Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time', is_active: true },
  { id: '2', title: 'Marketing Manager', department: 'Marketing', location: 'Lagos, Nigeria', type: 'Full-time', is_active: true },
];

export default function CareersPage() {
  const [careers, setCareers] = useState(mockCareers);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', department: '', location: '', type: '', description: '' });

  const handleSave = () => {
    setCareers([...careers, { id: Date.now().toString(), ...formData, is_active: true }]);
    setShowModal(false);
    setFormData({ title: '', department: '', location: '', type: '', description: '' });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this job posting?')) return;
    setCareers(careers.filter(c => c.id !== id));
  };

  const handleToggle = (id: string) => {
    setCareers(careers.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Careers</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="mr-2 h-4 w-4" /> Add Job</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {careers.map((job) => (
          <div key={job.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg">{job.title}</h3>
                <p className="text-gray-500 text-sm">{job.department}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                  <Badge variant="secondary">{job.type}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant={job.is_active ? 'default' : 'secondary'}>{job.is_active ? 'Active' : 'Inactive'}</Badge>
                <Button variant="ghost" size="sm" onClick={() => handleToggle(job.id)}>{job.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(job.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Add Job</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><Label>Job Title *</Label><Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Department</Label><Input value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} /></div>
                <div><Label>Location</Label><Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} /></div>
              </div>
              <div><Label>Job Type</Label><Input value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} placeholder="Full-time, Part-time, Contract" /></div>
              <div><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={4} /></div>
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
