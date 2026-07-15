'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Users, Building, FileText, UserPlus, LogOut, 
  Plus, Edit, Trash2, Eye, EyeOff, ChevronRight,
  Home, LayoutDashboard, Briefcase, Users as UsersIcon,
  Mail, Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

type Tab = 'dashboard' | 'users' | 'team' | 'consultants' | 'properties' | 'newsletters' | 'subscribers';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

interface Consultant {
  id: string;
  name: string;
  title: string;
  specialization: string;
  bio: string;
  image_url: string;
  is_active: boolean;
}

interface Property {
  id: string;
  title: string;
  property_type: string;
  status: string;
  price: number;
  location: string;
  is_active: boolean;
}

interface Newsletter {
  id: string;
  title: string;
  slug: string;
  category: string;
  is_published: boolean;
  created_at: string;
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

    // Check if admin
    const { data: adminData } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', authUser.id)
      .single();

    if (!adminData) {
      router.push('/en');
      return;
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    setUser(profile || { id: authUser.id, email: authUser.email || '', full_name: '', role: 'admin' });
    setIsLoading(false);
  };

  const loadData = async () => {
    const supabase = createClient();
    
    switch (activeTab) {
      case 'team':
        const { data: team } = await supabase
          .from('team_members')
          .select('*')
          .order('sort_order', { ascending: true });
        setTeamMembers(team || []);
        break;
      case 'consultants':
        const { data: cons } = await supabase
          .from('consultants')
          .select('*')
          .order('sort_order', { ascending: true });
        setConsultants(cons || []);
        break;
      case 'properties':
        const { data: props } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });
        setProperties(props || []);
        break;
      case 'newsletters':
        const { data: news } = await supabase
          .from('newsletters')
          .select('*')
          .order('created_at', { ascending: false });
        setNewsletters(news || []);
        break;
      case 'subscribers':
        const { data: subs } = await supabase
          .from('newsletter_subscribers')
          .select('*')
          .order('subscribed_at', { ascending: false });
        setSubscribers(subs || []);
        break;
      case 'users':
        const { data: usrs } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });
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
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/en" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="font-heading text-xl font-bold text-gray-900 dark:text-white">
                  Admin Panel
                </span>
              </Link>
              <Badge variant="secondary">{user?.email}</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/en">
                <Button variant="ghost" size="sm">
                  <Home className="mr-2 h-4 w-4" />
                  View Site
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
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

          {/* Main Content */}
          <main className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Dashboard */}
              {activeTab === 'dashboard' && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Total Users</p>
                            <p className="text-2xl font-bold">{users.length}</p>
                          </div>
                          <UsersIcon className="h-10 w-10 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Properties</p>
                            <p className="text-2xl font-bold">{properties.length}</p>
                          </div>
                          <Building2 className="h-10 w-10 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Subscribers</p>
                            <p className="text-2xl font-bold">{subscribers.length}</p>
                          </div>
                          <Mail className="h-10 w-10 text-purple-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Newsletters</p>
                            <p className="text-2xl font-bold">{newsletters.length}</p>
                          </div>
                          <FileText className="h-10 w-10 text-orange-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Users Management */}
              {activeTab === 'users' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
                  </div>
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
                                <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                                  {u.role}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">{new Date(u.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                          {users.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                No users found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Team Management */}
              {activeTab === 'team' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Members</h1>
                    <Button><Plus className="mr-2 h-4 w-4" /> Add Member</Button>
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
                          {teamMembers.map((member) => (
                            <tr key={member.id}>
                              <td className="px-6 py-4">{member.name}</td>
                              <td className="px-6 py-4">{member.position}</td>
                              <td className="px-6 py-4">
                                <Badge variant={member.is_active ? 'default' : 'secondary'}>
                                  {member.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-right space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => toggleActive('team_members', member.id, member.is_active)}>
                                  {member.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                                <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteItem('team_members', member.id)}><Trash2 className="h-4 w-4" /></Button>
                              </td>
                            </tr>
                          ))}
                          {teamMembers.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                No team members found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Consultants Management */}
              {activeTab === 'consultants' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Consultants</h1>
                    <Button><Plus className="mr-2 h-4 w-4" /> Add Consultant</Button>
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
                              <td className="px-6 py-4">
                                <Badge variant={c.is_active ? 'default' : 'secondary'}>
                                  {c.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-right space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => toggleActive('consultants', c.id, c.is_active)}>
                                  {c.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                                <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteItem('consultants', c.id)}><Trash2 className="h-4 w-4" /></Button>
                              </td>
                            </tr>
                          ))}
                          {consultants.length === 0 && (
                            <tr>
                              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                No consultants found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Properties Management */}
              {activeTab === 'properties' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Properties</h1>
                    <Button><Plus className="mr-2 h-4 w-4" /> Add Property</Button>
                  </div>
                  <Card>
                    <CardContent className="p-0">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {properties.map((p) => (
                            <tr key={p.id}>
                              <td className="px-6 py-4">{p.title}</td>
                              <td className="px-6 py-4"><Badge variant="secondary">{p.property_type}</Badge></td>
                              <td className="px-6 py-4">${p.price?.toLocaleString() || 'N/A'}</td>
                              <td className="px-6 py-4">{p.location}</td>
                              <td className="px-6 py-4">
                                <Badge variant={p.status === 'available' ? 'default' : 'secondary'}>
                                  {p.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-right space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => toggleActive('properties', p.id, p.is_active)}>
                                  {p.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                                <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteItem('properties', p.id)}><Trash2 className="h-4 w-4" /></Button>
                              </td>
                            </tr>
                          ))}
                          {properties.length === 0 && (
                            <tr>
                              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                No properties found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Newsletters Management */}
              {activeTab === 'newsletters' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Newsletters</h1>
                    <Button><Plus className="mr-2 h-4 w-4" /> Create Newsletter</Button>
                  </div>
                  <Card>
                    <CardContent className="p-0">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {newsletters.map((n) => (
                            <tr key={n.id}>
                              <td className="px-6 py-4">{n.title}</td>
                              <td className="px-6 py-4">{n.category || 'N/A'}</td>
                              <td className="px-6 py-4">
                                <Badge variant={n.is_published ? 'default' : 'secondary'}>
                                  {n.is_published ? 'Published' : 'Draft'}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">{new Date(n.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4 text-right space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => togglePublish(n.id, n.is_published)}>
                                  {n.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                                <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteItem('newsletters', n.id)}><Trash2 className="h-4 w-4" /></Button>
                              </td>
                            </tr>
                          ))}
                          {newsletters.length === 0 && (
                            <tr>
                              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                No newsletters found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Subscribers Management */}
              {activeTab === 'subscribers' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Newsletter Subscribers</h1>
                  </div>
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
                              <td className="px-6 py-4">
                                <Badge variant={s.is_active ? 'default' : 'secondary'}>
                                  {s.is_active ? 'Active' : 'Unsubscribed'}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">{new Date(s.subscribed_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4 text-right space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => deleteItem('newsletter_subscribers', s.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                          {subscribers.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                No subscribers found
                              </td>
                            </tr>
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
    </div>
  );
}
