'use client';

import { Clock, User, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const mockLogs = [
  { id: '1', action: 'User Login', user: 'admin@paraysco.com', details: 'Logged in from 192.168.1.1', timestamp: '2024-01-15 10:30:00' },
  { id: '2', action: 'Property Created', user: 'admin@paraysco.com', details: 'Created "Luxury Apartment" property', timestamp: '2024-01-15 11:00:00' },
  { id: '3', action: 'Newsletter Published', user: 'admin@paraysco.com', details: 'Published "Q4 Market Report"', timestamp: '2024-01-15 14:30:00' },
  { id: '4', action: 'User Logout', user: 'admin@paraysco.com', details: 'Session ended', timestamp: '2024-01-15 18:00:00' },
  { id: '5', action: 'Settings Updated', user: 'admin@paraysco.com', details: 'Updated company contact info', timestamp: '2024-01-16 09:00:00' },
];

export default function AuditLogsPage() {
  const getActionColor = (action: string) => {
    if (action.includes('Create') || action.includes('Publish')) return 'text-green-600';
    if (action.includes('Delete') || action.includes('Logout')) return 'text-red-600';
    if (action.includes('Update') || action.includes('Login')) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Audit Logs</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {mockLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg">
                  <Activity className={`h-5 w-5 ${getActionColor(log.action)}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{log.action}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{log.details}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {log.user}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {log.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
