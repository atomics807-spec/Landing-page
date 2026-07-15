'use client';

import { useState, useEffect } from 'react';
import { Users, Building2, Mail, FileText, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const supabase = createClient();
    const tables = ['users', 'properties', 'newsletter_subscribers', 'newsletters', 'team_members', 'consultants'];
    const results: any = {};
    
    for (const table of tables) {
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      results[table] = count || 0;
    }
    setStats(results);
  };

  const statCards = [
    { label: 'Users', count: stats.users, icon: Users, color: 'blue' },
    { label: 'Properties', count: stats.properties, icon: Building2, color: 'green' },
    { label: 'Subscribers', count: stats.newsletter_subscribers, icon: Mail, color: 'purple' },
    { label: 'Newsletters', count: stats.newsletters, icon: FileText, color: 'orange' },
    { label: 'Team Members', count: stats.team_members, icon: Users, color: 'indigo' },
    { label: 'Consultants', count: stats.consultants, icon: Briefcase, color: 'pink' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.count}</p>
                </div>
                <stat.icon className={`h-10 w-10 text-${stat.color}-500`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
