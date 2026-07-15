'use client';

import { useState } from 'react';
import { Save, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: 'Paraysco Consulting Inc.',
    email: 'contact@paraysco.com',
    phone: '+234 123 456 7890',
    address: 'Lagos, Nigeria',
    description: 'Leading consulting firm offering real estate, engineering, and business advisory services.',
    facebook: 'https://facebook.com/paraysco',
    twitter: 'https://twitter.com/paraysco',
    linkedin: 'https://linkedin.com/company/paraysco',
    instagram: 'https://instagram.com/paraysco',
  });

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="space-y-6">
          {/* Company Settings */}
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Building className="h-5 w-5" /> Company Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Company Name</Label>
                <Input value={settings.companyName} onChange={(e) => setSettings({...settings, companyName: e.target.value})} />
              </div>
              <div>
                <Label>Contact Email</Label>
                <Input type="email" value={settings.email} onChange={(e) => setSettings({...settings, email: e.target.value})} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={settings.phone} onChange={(e) => setSettings({...settings, phone: e.target.value})} />
              </div>
              <div>
                <Label>Address</Label>
                <Input value={settings.address} onChange={(e) => setSettings({...settings, address: e.target.value})} />
              </div>
            </div>
            <div className="mt-4">
              <Label>Company Description</Label>
              <Textarea value={settings.description} onChange={(e) => setSettings({...settings, description: e.target.value})} rows={4} />
            </div>
          </div>

          <hr className="dark:border-gray-700" />

          {/* Social Media */}
          <div>
            <h2 className="text-lg font-bold mb-4">Social Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Facebook</Label>
                <Input type="url" value={settings.facebook} onChange={(e) => setSettings({...settings, facebook: e.target.value})} />
              </div>
              <div>
                <Label>Twitter</Label>
                <Input type="url" value={settings.twitter} onChange={(e) => setSettings({...settings, twitter: e.target.value})} />
              </div>
              <div>
                <Label>LinkedIn</Label>
                <Input type="url" value={settings.linkedin} onChange={(e) => setSettings({...settings, linkedin: e.target.value})} />
              </div>
              <div>
                <Label>Instagram</Label>
                <Input type="url" value={settings.instagram} onChange={(e) => setSettings({...settings, instagram: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" /> Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
