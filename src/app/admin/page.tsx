'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, FileText, LogOut, Plus, Edit, Trash2, Eye, EyeOff, ChevronRight,
  Home, LayoutDashboard, Briefcase, Users as UsersIcon,
  Mail, Building2, X, Upload, Star, Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';

type Tab = 'dashboard' | 'users' | 'team' | 'consultants' | 'properties' | 'newsletters' | 'subscribers';

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

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image_url: string;
  is_active: boolean;
}

interface Consultant {
  id: string;
  name: string;
  title: string;
  specialization: string;
  bio: string;
  image_url: string;
  email: string;
  phone: string;
  linkedin_url: string;
  is_active: boolean;
}

interface Newsletter {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  is_published: boolean;
}

interface Subscriber {
  id: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState<Tab | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Data states
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, activeTab]);

  const checkAuth = async () => {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) {
      router.push('/en/login');
      return;
    }

    const { data: adminData } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', authUser.id)
      .single();

    if (!adminData) {
      router.push('/en');
      return;
    }

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    setUser(profile || { id: authUser.id, email: authUser.email || '', full_name: '', role: 'admin', created_at: '' });
    setIsLoading(false);
  };

  const loadData = async () => {
    const supabase = createClient();
    
    switch (activeTab) {
      case 'team':
        const { data: team } = await supabase.from('team_members').select('*').order('sort_order', { ascending: true });
        setTeamMembers(team || []);
        break;
      case 'consultants':
        const { data: cons } = await supabase.from('consultants').select('*').order('sort_order', { ascending: true });
        setConsultants(cons || []);
        break;
      case 'properties':
        const { data: props } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
        setProperties(props || []);
        break;
      case 'newsletters':
        const { data: news } = await supabase.from('newsletters').select('*').order('created_at', { ascending: false });
        setNewsletters(news || []);
        break;
      case 'subscribers':
        const { data: subs } = await supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false });
        setSubscribers(subs || []);
        break;
      case 'users':
        const { data: usrs } = await supabase.from('users').select('*').order('created_at', { ascending: false });
        setUsers(usrs || []);
        break;
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/en/login');
  };

  const toggleActive = async (table: string, id: string, currentStatus: boolean) => {
    const supabase = createClient();
    await supabase.from(table).update({ is_active: !currentStatus }).eq('id', id);
    loadData();
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    const supabase = createClient();
    await supabase.from('properties').update({ is_featured: !currentStatus }).eq('id', id);
    loadData();
  };

  const updatePropertyStatus = async (id: string, newStatus: string) => {
    const supabase = createClient();
    await supabase.from('properties').update({ status: newStatus }).eq('id', id);
    loadData();
  };

  const deleteItem = async (table: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const supabase = createClient();
    await supabase.from(table).delete().eq('id', id);
    loadData();
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    const supabase = createClient();
    await supabase.from('newsletters').update({ 
      is_published: !currentStatus,
      published_at: !currentStatus ? new Date().toISOString() : null
    }).eq('id', id);
    loadData();
  };

  const uploadImage = async (file: File, folder: string): Promise<string | null> => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage.from('images').upload(filePath, file);
    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);
    return urlData.publicUrl;
  };

  const handleSaveProperty = async (formData: any) => {
    setIsSaving(true);
    const supabase = createClient();

    try {
      let images: string[] = formData.existingImages || [];
      if (formData.newImages && formData.newImages.length > 0) {
        for (const img of formData.newImages) {
          const url = await uploadImage(img, 'properties');
          if (url) images.push(url);
        }
      }

      const propertyData = {
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
        features: formData.features ? formData.features.split(',').map((f: string) => f.trim()).filter(Boolean) : [],
        images: images,
        is_featured: formData.is_featured || false,
        is_active: true,
      };

      if (editingItem) {
        await supabase.from('properties').update(propertyData).eq('id', editingItem.id);
      } else {
        await supabase.from('properties').insert(propertyData);
      }

      setShowModal(null);
      setEditingItem(null);
      loadData();
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTeamMember = async (formData: any) => {
    setIsSaving(true);
    const supabase = createClient();

    try {
      let image_url = formData.image_url || '';
      if (formData.image instanceof File) {
        const url = await uploadImage(formData.image, 'team');
        if (url) image_url = url;
      }

      await supabase.from('team_members').insert({
        name: formData.name,
        position: formData.position,
        bio: formData.bio,
        image_url: image_url,
        sort_order: parseInt(formData.sort_order) || 0,
        is_active: true,
      });

      setShowModal(null);
      loadData();
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveConsultant = async (formData: any) => {
    setIsSaving(true);
    const supabase = createClient();

    try {
      let image_url = formData.image_url || '';
      if (formData.image instanceof File) {
        const url = await uploadImage(formData.image, 'consultants');
        if (url) image_url = url;
      }

      await supabase.from('consultants').insert({
        name: formData.name,
        title: formData.title,
        specialization: formData.specialization,
        bio: formData.bio,
        image_url: image_url,
        email: formData.email,
        phone: formData.phone,
        linkedin_url: formData.linkedin_url,
        sort_order: parseInt(formData.sort_order) || 0,
        is_active: true,
      });

      setShowModal(null);
      loadData();
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNewsletter = async (formData: any) => {
    setIsSaving(true);
    const supabase = createClient();

    try {
      let cover_image = formData.cover_image || '';
      if (formData.image instanceof File) {
        const url = await uploadImage(formData.image, 'newsletters');
        if (url) cover_image = url;
      }

      const slug = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      await supabase.from('newsletters').insert({
        title: formData.title,
        slug: slug,
        excerpt: formData.excerpt,
        content: formData.content,
        cover_image: cover_image,
        category: formData.category,
        is_published: formData.is_published || false,
        published_at: formData.is_published ? new Date().toISOString() : null,
      });

      setShowModal(null);
      loadData();
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'consultants', label: 'Consultants', icon: Briefcase },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'newsletters', label: 'Newsletters', icon: FileText },
    { id: 'subscribers', label: 'Subscribers', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/en" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="font-heading text-xl font-bold text-gray-900 dark:text-white">Admin Panel</span>
              </Link>
              <Badge variant="secondary">{user?.email}</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/en">
                <Button variant="ghost" size="sm"><Home className="mr-2 h-4 w-4" />View Site</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as Tab)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === item.id
                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                        {activeTab === item.id && <ChevronRight className="ml-auto h-4 w-4" />}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </aside>

          <main className="flex-1">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

              {/* Dashboard */}
              {activeTab === 'dashboard' && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Users', count: users.length, icon: UsersIcon, color: 'blue' },
                      { label: 'Properties', count: properties.length, icon: Building2, color: 'green' },
                      { label: 'Subscribers', count: subscribers.length, icon: Mail, color: 'purple' },
                      { label: 'Newsletters', count: newsletters.length, icon: FileText, color: 'orange' },
                    ].map((stat) => (
                      <Card key={stat.label} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab(stat.label.toLowerCase() as Tab)}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">{stat.label}</p>
                              <p className="text-2xl font-bold">{stat.count}</p>
                            </div>
                            <stat.icon className={`h-10 w-10 text-${stat.color}-500`} />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {activeTab === 'users' && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">User Management</h1>
                  <Card>
                    <CardContent className="p-0">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {users.map((u) => (
                            <tr key={u.id}>
                              <td className="px-6 py-4">{u.email}</td>
                              <td className="px-6 py-4">{u.full_name || 'N/A'}</td>
                              <td className="px-6 py-4">
                                <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>{u.role}</Badge>
                              </td>
                              <td className="px-6 py-4">{u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</td>
                            </tr>
                          ))}
                          {users.length === 0 && (
                            <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No users found</td></tr>
                          )}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Team */}
              {activeTab === 'team' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Members</h1>
                    <Button onClick={() => { setEditingItem(null); setShowModal('team'); }}>
                      <Plus className="mr-2 h-4 w-4" /> Add Member
                    </Button>
                  </div>
                  <Card>
                    <CardContent className="p-0">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {teamMembers.map((m) => (
                            <tr key={m.id}>
                              <td className="px-6 py-4">{m.name}</td>
                              <td className="px-6 py-4">{m.position}</td>
                              <td className="px-6 py-4"><Badge variant={m.is_active ? 'default' : 'secondary'}>{m.is_active ? 'Active' : 'Inactive'}</Badge></td>
                              <td className="px-6 py-4 text-right space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => toggleActive('team_members', m.id, m.is_active)}>
                                  {m.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteItem('team_members', m.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                              </td>
                            </tr>
                          ))}
                          {teamMembers.length === 0 && (
                            <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No team members. Click "Add Member" to create one.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Consultants */}
              {activeTab === 'consultants' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Consultants</h1>
                    <Button onClick={() => { setEditingItem(null); setShowModal('consultants'); }}>
                      <Plus className="mr-2 h-4 w-4" /> Add Consultant
                    </Button>
                  </div>
                  <Card>
                    <CardContent className="p-0">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {consultants.map((c) => (
                            <tr key={c.id}>
                              <td className="px-6 py-4">{c.name}</td>
                              <td className="px-6 py-4">{c.title}</td>
                              <td className="px-6 py-4">{c.specialization}</td>
                              <td className="px-6 py-4"><Badge variant={c.is_active ? 'default' : 'secondary'}>{c.is_active ? 'Active' : 'Inactive'}</Badge></td>
                              <td className="px-6 py-4 text-right space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => toggleActive('consultants', c.id, c.is_active)}>
                                  {c.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteItem('consultants', c.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                              </td>
                            </tr>
                          ))}
                          {consultants.length === 0 && (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No consultants. Click "Add Consultant" to create one.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Properties */}
              {activeTab === 'properties' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Properties</h1>
                    <Button onClick={() => { setEditingItem(null); setShowModal('properties'); }}>
                      <Plus className="mr-2 h-4 w-4" /> Add Property
                    </Button>
                  </div>
                  <Card>
                    <CardContent className="p-0">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {properties.map((p) => (
                            <tr key={p.id}>
                              <td className="px-6 py-4">
                                {p.images && p.images[0] ? (
                                  <img src={p.images[0]} alt={p.title} className="w-16 h-12 object-cover rounded" />
                                ) : (
                                  <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center"><ImageIcon className="h-4 w-4 text-gray-400" /></div>
                                )}
                              </td>
                              <td className="px-6 py-4 font-medium">{p.title}</td>
                              <td className="px-6 py-4"><Badge variant="secondary">{p.property_type}</Badge></td>
                              <td className="px-6 py-4">${p.price?.toLocaleString() || 'N/A'}</td>
                              <td className="px-6 py-4">
                                <select 
                                  value={p.status}
                                  onChange={(e) => updatePropertyStatus(p.id, e.target.value)}
                                  className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${
                                    p.status === 'available' ? 'bg-green-100 text-green-800' :
                                    p.status === 'booked' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}
                                >
                                  <option value="available">Available</option>
                                  <option value="booked">Booked</option>
                                  <option value="sold">Sold</option>
                                </select>
                              </td>
                              <td className="px-6 py-4">
                                <Button variant="ghost" size="sm" onClick={() => toggleFeatured(p.id, p.is_featured)} className={p.is_featured ? 'text-yellow-500' : ''}>
                                  <Star className={`h-4 w-4 ${p.is_featured ? 'fill-yellow-500' : ''}`} />
                                </Button>
                              </td>
                              <td className="px-6 py-4 text-right space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => toggleActive('properties', p.id, p.is_active)}>
                                  {p.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => { setEditingItem(p); setShowModal('properties'); }}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteItem('properties', p.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                              </td>
                            </tr>
                          ))}
                          {properties.length === 0 && (
                            <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">No properties. Click "Add Property" to create one.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Newsletters */}
              {activeTab === 'newsletters' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Newsletters</h1>
                    <Button onClick={() => { setEditingItem(null); setShowModal('newsletters'); }}>
                      <Plus className="mr-2 h-4 w-4" /> Create Newsletter
                    </Button>
                  </div>
                  <Card>
                    <CardContent className="p-0">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {newsletters.map((n) => (
                            <tr key={n.id}>
                              <td className="px-6 py-4">{n.title}</td>
                              <td className="px-6 py-4">{n.category || 'N/A'}</td>
                              <td className="px-6 py-4"><Badge variant={n.is_published ? 'default' : 'secondary'}>{n.is_published ? 'Published' : 'Draft'}</Badge></td>
                              <td className="px-6 py-4 text-right space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => togglePublish(n.id, n.is_published)}>
                                  {n.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteItem('newsletters', n.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                              </td>
                            </tr>
                          ))}
                          {newsletters.length === 0 && (
                            <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No newsletters. Click "Create Newsletter" to create one.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Subscribers */}
              {activeTab === 'subscribers' && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Newsletter Subscribers</h1>
                  <Card>
                    <CardContent className="p-0">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscribed</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {subscribers.map((s) => (
                            <tr key={s.id}>
                              <td className="px-6 py-4">{s.email}</td>
                              <td className="px-6 py-4"><Badge variant={s.is_active ? 'default' : 'secondary'}>{s.is_active ? 'Active' : 'Unsubscribed'}</Badge></td>
                              <td className="px-6 py-4">{s.subscribed_at ? new Date(s.subscribed_at).toLocaleDateString() : 'N/A'}</td>
                              <td className="px-6 py-4 text-right">
                                <Button variant="ghost" size="sm" onClick={() => deleteItem('newsletter_subscribers', s.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                              </td>
                            </tr>
                          ))}
                          {subscribers.length === 0 && (
                            <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No subscribers found</td></tr>
                          )}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {showModal === 'properties' && (
                <PropertyModal item={editingItem} onClose={() => { setShowModal(null); setEditingItem(null); }} onSave={handleSaveProperty} isSaving={isSaving} />
              )}
              {showModal === 'team' && (
                <TeamModal onClose={() => setShowModal(null)} onSave={handleSaveTeamMember} isSaving={isSaving} />
              )}
              {showModal === 'consultants' && (
                <ConsultantModal onClose={() => setShowModal(null)} onSave={handleSaveConsultant} isSaving={isSaving} />
              )}
              {showModal === 'newsletters' && (
                <NewsletterModal onClose={() => setShowModal(null)} onSave={handleSaveNewsletter} isSaving={isSaving} />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Property Modal
function PropertyModal({ item, onClose, onSave, isSaving }: { item: Property | null; onClose: () => void; onSave: (data: any) => void; isSaving: boolean }) {
  const [formData, setFormData] = useState({
    title: item?.title || '', description: item?.description || '', property_type: item?.property_type || 'residential',
    status: item?.status || 'available', price: item?.price?.toString() || '', location: item?.location || '',
    address: item?.address || '', bedrooms: item?.bedrooms?.toString() || '', bathrooms: item?.bathrooms?.toString() || '',
    area_sqm: item?.area_sqm?.toString() || '', features: item?.features?.join(', ') || '',
    is_featured: item?.is_featured || false, existingImages: item?.images || [], newImages: [] as File[],
  });

  return (
    <>
      <div className="p-6 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold">{item ? 'Edit Property' : 'Add Property'}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X className="h-5 w-5" /></button>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-4">
        <div><Label>Title *</Label><Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Type *</Label>
            <select value={formData.property_type} onChange={(e) => setFormData({...formData, property_type: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
              <option value="residential">Residential</option><option value="commercial">Commercial</option><option value="land">Land</option><option value="industrial">Industrial</option>
            </select>
          </div>
          <div><Label>Status</Label>
            <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
              <option value="available">Available</option><option value="booked">Booked</option><option value="sold">Sold</option>
            </select>
          </div>
        </div>
        <div><Label>Price (USD) *</Label><Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Location *</Label><Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required /></div>
          <div><Label>Address</Label><Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><Label>Bedrooms</Label><Input type="number" value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: e.target.value})} /></div>
          <div><Label>Bathrooms</Label><Input type="number" value={formData.bathrooms} onChange={(e) => setFormData({...formData, bathrooms: e.target.value})} /></div>
          <div><Label>Area (sqm)</Label><Input type="number" value={formData.area_sqm} onChange={(e) => setFormData({...formData, area_sqm: e.target.value})} /></div>
        </div>
        <div><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} /></div>
        <div><Label>Features (comma separated)</Label><Input value={formData.features} onChange={(e) => setFormData({...formData, features: e.target.value})} placeholder="Pool, Garden, Garage" /></div>
        <div>
          <Label>Images</Label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <input type="file" multiple accept="image/*" onChange={(e) => setFormData({...formData, newImages: Array.from(e.target.files || [])})} className="hidden" id="property-images" />
            <label htmlFor="property-images" className="cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">Click to upload images</p>
            </label>
          </div>
          {(formData.existingImages.length > 0 || formData.newImages.length > 0) && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {formData.existingImages.map((img, i) => <img key={`ex-${i}`} src={img} alt="" className="w-16 h-16 object-cover rounded" />)}
              {formData.newImages.map((img, i) => <div key={`new-${i}`} className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs">New {i + 1}</div>)}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2"><input type="checkbox" id="featured" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} /><Label htmlFor="featured" className="cursor-pointer">Mark as Featured</Label></div>
        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" disabled={isSaving} className="flex-1">{isSaving ? 'Saving...' : (item ? 'Update' : 'Create')}</Button>
        </div>
      </form>
    </>
  );
}

// Team Modal
function TeamModal({ onClose, onSave, isSaving }: { onClose: () => void; onSave: (data: any) => void; isSaving: boolean }) {
  const [formData, setFormData] = useState({ name: '', position: '', bio: '', image: null as File | null, image_url: '', sort_order: '0' });

  return (
    <>
      <div className="p-6 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold">Add Team Member</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X className="h-5 w-5" /></button>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-4">
        <div><Label>Name *</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
        <div><Label>Position *</Label><Input value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} required /></div>
        <div><Label>Bio</Label><Textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} /></div>
        <div><Label>Sort Order</Label><Input type="number" value={formData.sort_order} onChange={(e) => setFormData({...formData, sort_order: e.target.value})} /></div>
        <div>
          <Label>Image</Label>
          <input type="file" accept="image/*" onChange={(e) => setFormData({...formData, image: e.target.files?.[0] || null})} className="hidden" id="team-image" />
          <label htmlFor="team-image" className="block border-2 border-dashed rounded-lg p-4 text-center cursor-pointer">
            <Upload className="h-6 w-6 mx-auto mb-1 text-gray-400" />
            <p className="text-xs text-gray-500">Upload image</p>
          </label>
        </div>
        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" disabled={isSaving} className="flex-1">{isSaving ? 'Saving...' : 'Create'}</Button>
        </div>
      </form>
    </>
  );
}

// Consultant Modal
function ConsultantModal({ onClose, onSave, isSaving }: { onClose: () => void; onSave: (data: any) => void; isSaving: boolean }) {
  const [formData, setFormData] = useState({ name: '', title: '', specialization: '', bio: '', email: '', phone: '', linkedin_url: '', image: null as File | null, image_url: '', sort_order: '0' });

  return (
    <>
      <div className="p-6 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold">Add Consultant</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X className="h-5 w-5" /></button>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Name *</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
          <div><Label>Title *</Label><Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required /></div>
        </div>
        <div><Label>Specialization *</Label><Input value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} required /></div>
        <div><Label>Bio</Label><Textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
          <div><Label>Phone</Label><Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
        </div>
        <div><Label>LinkedIn URL</Label><Input value={formData.linkedin_url} onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})} /></div>
        <div><Label>Sort Order</Label><Input type="number" value={formData.sort_order} onChange={(e) => setFormData({...formData, sort_order: e.target.value})} /></div>
        <div>
          <Label>Image</Label>
          <input type="file" accept="image/*" onChange={(e) => setFormData({...formData, image: e.target.files?.[0] || null})} className="hidden" id="consultant-image" />
          <label htmlFor="consultant-image" className="block border-2 border-dashed rounded-lg p-4 text-center cursor-pointer">
            <Upload className="h-6 w-6 mx-auto mb-1 text-gray-400" />
            <p className="text-xs text-gray-500">Upload image</p>
          </label>
        </div>
        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" disabled={isSaving} className="flex-1">{isSaving ? 'Saving...' : 'Create'}</Button>
        </div>
      </form>
    </>
  );
}

// Newsletter Modal
function NewsletterModal({ onClose, onSave, isSaving }: { onClose: () => void; onSave: (data: any) => void; isSaving: boolean }) {
  const [formData, setFormData] = useState({ title: '', excerpt: '', content: '', category: '', image: null as File | null, cover_image: '', is_published: false });

  return (
    <>
      <div className="p-6 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold">Create Newsletter</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X className="h-5 w-5" /></button>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-4">
        <div><Label>Title *</Label><Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required /></div>
        <div><Label>Category</Label><Input value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="Insights, News, Guide" /></div>
        <div><Label>Excerpt</Label><Textarea value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} rows={2} /></div>
        <div><Label>Content *</Label><Textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={8} required /></div>
        <div>
          <Label>Cover Image</Label>
          <input type="file" accept="image/*" onChange={(e) => setFormData({...formData, image: e.target.files?.[0] || null})} className="hidden" id="newsletter-image" />
          <label htmlFor="newsletter-image" className="block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer">
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">Upload cover image</p>
          </label>
        </div>
        <div className="flex items-center gap-2"><input type="checkbox" id="publish" checked={formData.is_published} onChange={(e) => setFormData({...formData, is_published: e.target.checked})} /><Label htmlFor="publish" className="cursor-pointer">Publish immediately</Label></div>
        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" disabled={isSaving} className="flex-1">{isSaving ? 'Saving...' : 'Create'}</Button>
        </div>
      </form>
    </>
  );
}
