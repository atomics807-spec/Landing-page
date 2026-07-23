'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { MapPin, Bed, Bath, Square, Check, ArrowLeft, Share2, ChevronLeft, ChevronRight, Phone, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/currencies';
import { Share } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  description: string;
  property_type: string;
  status: string;
  price: number;
  currency: string;
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

export default function PropertyDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    async function fetchProperty() {
      const supabase = createClient();
      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) {
        setProperty(data as Property);
      }
      setLoading(false);
    }
    fetchProperty();
  }, [id]);

  const handleShare = async () => {
    setIsSharing(true);
    const shareData = {
      title: property?.title || 'Property',
      text: `Check out this property: ${property?.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
    setIsSharing(false);
  };

  const nextImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Property not found</h1>
          <Link href={`/${locale}/properties`}>
            <Button className="mt-4">Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    available: 'bg-green-100 text-green-800',
    sold: 'bg-red-100 text-red-800',
    booked: 'bg-yellow-100 text-yellow-800',
    reserved: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href={`/${locale}/properties`} className="inline-flex items-center text-primary-100 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Badge variant="secondary" className={`${statusColors[property.status] || 'bg-gray-100'} capitalize`}>
                {property.status}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mt-4">{property.title}</h1>
              <div className="flex items-center text-primary-100 mt-2">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{property.location}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl md:text-4xl font-bold">{formatPrice(property.price, property.currency)}</p>
              <p className="text-primary-100 text-sm capitalize">{property.property_type}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Property Image Gallery */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="relative aspect-video bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-xl overflow-hidden">
            {property.images && property.images.length > 0 ? (
              <>
                <img
                  src={property.images[currentImageIndex]}
                  alt={`${property.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {property.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-primary-600 dark:text-primary-300 text-xl">No Images Available</span>
              </div>
            )}
          </div>
          {/* Share Button */}
          <div className="mt-4 flex justify-end">
            <Button onClick={handleShare} variant="outline" disabled={isSharing}>
              <Share2 className="w-4 h-4 mr-2" />
              {isSharing ? 'Sharing...' : 'Share Property'}
            </Button>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Description</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {property.description || 'No description available.'}
                </p>
              </div>

              {/* Property Details */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {property.bedrooms > 0 && (
                    <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Bed className="w-8 h-8 text-primary-600 mb-2" />
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">{property.bedrooms}</span>
                      <span className="text-sm text-gray-500">Bedrooms</span>
                    </div>
                  )}
                  <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Bath className="w-8 h-8 text-primary-600 mb-2" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{property.bathrooms}</span>
                    <span className="text-sm text-gray-500">Bathrooms</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Square className="w-8 h-8 text-primary-600 mb-2" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{property.area_sqm || 0}</span>
                    <span className="text-sm text-gray-500">Square Meters</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <MapPin className="w-8 h-8 text-primary-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white text-center">{property.location}</span>
                    <span className="text-sm text-gray-500">Location</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.features && property.features.length > 0 ? (
                    property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-primary-600" />
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No features listed.</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Location</h2>
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{property.address}</p>
                    <p className="text-gray-500">{property.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Interested in this property?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Contact us today to schedule a viewing or get more information.
                </p>
                <div className="space-y-3">
                  <Link href={`/${locale}/contact?subject=Inquiry about ${property.title}&property=${property.id}`} className="block">
                    <Button className="w-full" size="lg">
                      Contact Agent
                    </Button>
                  </Link>
                  <Link href={`/${locale}/contact?subject=Viewing Request for ${property.title}&property=${property.id}`} className="block">
                    <Button variant="outline" className="w-full" size="lg">
                      Request Viewing
                    </Button>
                  </Link>
                </div>
                <div className="mt-6 pt-6 border-t dark:border-gray-700">
                  <p className="text-sm text-gray-500 text-center">Or call us directly</p>
                  <p className="text-center text-lg font-semibold text-primary-600 mt-2">+237 676 914 581</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
