'use client';

import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const mockServices = [
  { id: '1', name: 'Real Estate Advisory', description: 'Property investment consulting', icon: 'building' },
  { id: '2', name: 'Engineering Services', description: 'Technical engineering solutions', icon: 'cog' },
];

export default function ServicesPage() {
  const [services, setServices] = useState(mockServices);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', icon: '' });

  const handleSave = () => {
    setServices([...services, { id: Date.now().toString(), ...formData }]);
    setShowModal(false);
    setFormData({ name: '', description: '', icon: '' });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this service?')) return;
    setServices(services.filter(s => s.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Services</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="mr-2 h-4 w-4" /> Add Service</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div key={s.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg">{s.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{s.description}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Add Service</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><Label>Service Name *</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
              <div><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
              <div><Label>Icon (lucide icon name)</Label><Input value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} placeholder="building, cog, chart" /></div>
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
