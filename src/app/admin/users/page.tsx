'use client';

import { useState, useEffect } from 'react';
import { DataTable, Modal, FormField } from '../components/table-components';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    setUsers(data || []);
    setIsLoading(false);
  };

  const columns = [
    { key: 'email', label: 'Email' },
    { key: 'full_name', label: 'Name', render: (row: User) => row.full_name || 'N/A' },
    { key: 'role', label: 'Role', render: (row: User) => (
      <Badge variant={row.role === 'admin' ? 'default' : 'secondary'}>{row.role}</Badge>
    )},
    { key: 'created_at', label: 'Joined', render: (row: User) => new Date(row.created_at).toLocaleDateString() },
  ];

  if (isLoading) {
    return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">User Management</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.full_name || 'N/A'}</td>
                <td className="px-6 py-4"><Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge></td>
                <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
