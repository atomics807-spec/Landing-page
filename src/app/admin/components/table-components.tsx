'use client';

import { Plus, Edit, Trash2, Eye, EyeOff, Star, Image as ImageIcon, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: any[];
  onAdd?: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onToggleActive?: (item: any) => void;
  onToggleFeatured?: (item: any) => void;
  onStatusChange?: (item: any, newStatus: string) => void;
  statusOptions?: { value: string; label: string; color: string }[];
  emptyMessage?: string;
  addButtonLabel?: string;
}

export function DataTable({
  title,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFeatured,
  onStatusChange,
  statusOptions,
  emptyMessage = 'No items found',
  addButtonLabel = 'Add New',
}: DataTableProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {onAdd && (
          <Button onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" /> {addButtonLabel}
          </Button>
        )}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((row, idx) => (
                <tr key={row.id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      {onToggleActive && (
                        <Button variant="ghost" size="sm" onClick={() => onToggleActive(row)}>
                          {row.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      )}
                      {onToggleFeatured && (
                        <Button variant="ghost" size="sm" onClick={() => onToggleFeatured(row)} className={row.is_featured ? 'text-yellow-500' : ''}>
                          <Star className={`h-4 w-4 ${row.is_featured ? 'fill-yellow-500' : ''}`} />
                        </Button>
                      )}
                      {onStatusChange && statusOptions && (
                        <select value={row.status || 'active'} onChange={(e) => onStatusChange(row, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusOptions.find(s => s.value === row.status)?.color || 'bg-gray-100'}`}>
                          {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                      )}
                      {onEdit && <Button variant="ghost" size="sm" onClick={() => onEdit(row)}><Edit className="h-4 w-4" /></Button>}
                      {onDelete && <Button variant="ghost" size="sm" onClick={() => onDelete(row)}><Trash2 className="h-4 w-4 text-red-500" /></Button>}
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">{emptyMessage}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave?: () => void;
  isSaving?: boolean;
  saveLabel?: string;
}

export function Modal({ isOpen, onClose, title, children, onSave, isSaving, saveLabel = 'Save' }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
        <div className="p-6 border-t flex gap-4">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          {onSave && <Button onClick={onSave} disabled={isSaving} className="flex-1">{isSaving ? 'Saving...' : saveLabel}</Button>}
        </div>
      </div>
    </div>
  );
}

export function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1 block">{label}{required && <span className="text-red-500 ml-1">*</span>}</Label>
      {children}
    </div>
  );
}

export function ImageUpload({ value, onChange, folder }: { value?: string; onChange: (file: File) => void; folder: string }) {
  return (
    <div className="border-2 border-dashed rounded-lg p-6 text-center">
      <input type="file" id="image-upload" onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])} className="hidden" accept="image/*" />
      <label htmlFor="image-upload" className="cursor-pointer">
        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-500">Click to upload image</p>
      </label>
      {value && <img src={value} alt="" className="mt-4 w-32 h-32 object-cover mx-auto rounded-lg" />}
    </div>
  );
}
