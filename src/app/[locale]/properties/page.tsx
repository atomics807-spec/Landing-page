'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Search, Filter, MapPin, Bed, Bath, Square, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';

// Mock data for properties
const mockProperties = [
  {
    id: '1',
    title: 'Luxury Beachfront Villa',
    location: 'Limbe, Cameroon',
    price: 250000,
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    status: 'available',
    category: 'residential',
    image: '/placeholder.jpg',
  },
  {
    id: '2',
    title: 'Modern Office Space',
    location: 'Douala, Cameroon',
    price: 180000,
    bedrooms: 0,
    bathrooms: 2,
    area: 300,
    status: 'available',
    category: 'commercial',
    image: '/placeholder.jpg',
  },
  {
    id: '3',
    title: 'Residential Land Plot',
    location: 'Buea, Cameroon',
    price: 75000,
    bedrooms: 0,
    bathrooms: 0,
    area: 600,
    status: 'sold',
    category: 'land',
    image: '/placeholder.jpg',
  },
  {
    id: '4',
    title: 'Commercial Building',
    location: 'Kumba, Cameroon',
    price: 350000,
    bedrooms: 0,
    bathrooms: 6,
    area: 800,
    status: 'reserved',
    category: 'commercial',
    image: '/placeholder.jpg',
  },
];

export default function PropertiesPage() {
  const locale = useLocale();
  const t = useTranslations('properties');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const statusColors: Record<string, string> = {
    available: 'available',
    sold: 'sold',
    reserved: 'reserved',
    archived: 'archived',
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder={t('filters.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('filters.category')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('filters.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">{t('status.available')}</SelectItem>
                  <SelectItem value="sold">{t('status.sold')}</SelectItem>
                  <SelectItem value="reserved">{t('status.reserved')}</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/${locale}/properties/${property.id}`}>
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-300 text-lg">
                          Property Image
                        </span>
                      </div>
                      <Badge
                        variant={statusColors[property.status] as 'available' | 'sold' | 'reserved' | 'archived'}
                        className="absolute top-4 right-4"
                      >
                        {t(`status.${property.status}`)}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.location}</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-2xl font-bold text-primary-600">
                          {formatCurrency(property.price)}
                        </p>
                        {property.bedrooms > 0 && (
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Bed className="h-4 w-4 mr-1" />
                              {property.bedrooms}
                            </span>
                            <span className="flex items-center">
                              <Bath className="h-4 w-4 mr-1" />
                              {property.bathrooms}
                            </span>
                            <span className="flex items-center">
                              <Square className="h-4 w-4 mr-1" />
                              {property.area}m²
                            </span>
                          </div>
                        )}
                      </div>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
