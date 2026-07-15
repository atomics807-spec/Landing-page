'use client';

import { useState } from 'react';
import { Trash2, Eye, Mail, Phone, MapPin, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

const mockMessages = [
  { id: '1', name: 'John Smith', email: 'john@example.com', phone: '+1234567890', subject: 'Investment Inquiry', message: 'I would like to know more about your investment opportunities.', is_read: false, created_at: '2024-01-15' },
  { id: '2', name: 'Jane Doe', email: 'jane@example.com', phone: '+0987654321', subject: 'Partnership', message: 'We are interested in a partnership.', is_read: true, created_at: '2024-01-14' },
];

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<typeof mockMessages[0] | null>(null);

  const handleDelete = (id: string) => {
    if (!confirm('Delete this message?')) return;
    setMessages(messages.filter(m => m.id !== id));
    if (selectedMessage?.id === id) setSelectedMessage(null);
  };

  const handleMarkRead = (id: string) => {
    setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => { setSelectedMessage(msg); handleMarkRead(msg.id); }}
                className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${!msg.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{msg.name}</h3>
                      {!msg.is_read && <Badge variant="default">New</Badge>}
                    </div>
                    <p className="text-sm text-gray-500">{msg.subject}</p>
                    <p className="text-sm text-gray-400 truncate mt-1">{msg.message}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && <div className="p-8 text-center text-gray-500">No messages</div>}
          </div>
        </div>

        {/* Message Detail */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          {selectedMessage ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{selectedMessage.subject}</h2>
                <Badge variant={selectedMessage.is_read ? 'secondary' : 'default'}>{selectedMessage.is_read ? 'Read' : 'Unread'}</Badge>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{selectedMessage.email}</span>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{selectedMessage.phone}</span>
                  </div>
                )}
                <div className="text-sm text-gray-500">Received: {selectedMessage.created_at}</div>
                <hr className="dark:border-gray-700" />
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a message to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
