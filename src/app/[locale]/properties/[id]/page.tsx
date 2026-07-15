import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { MapPin, Bed, Bath, Square, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PropertyDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

// Mock data - in production, fetch from Supabase
const properties = [
  {
    id: '1',
    title: 'Luxury Beachfront Villa',
    location: 'Lagos, Nigeria',
    address: '15 Victoria Island, Lagos',
    price: 2500000,
    type: 'Villa',
    status: 'available',
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    description: 'This stunning beachfront villa offers breathtaking ocean views and luxurious living spaces. Perfect for those seeking the ultimate coastal lifestyle.',
    features: ['Beach Access', 'Swimming Pool', 'Garden', 'Garage', 'Security', 'Air Conditioning', 'Smart Home', 'Furnished'],
    images: []
  },
  {
    id: '2',
    title: 'Modern Downtown Apartment',
    location: 'Abuja, Nigeria',
    address: 'Wuse District, Abuja',
    price: 850000,
    type: 'Apartment',
    status: 'available',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    description: 'Contemporary apartment in the heart of Abuja with stunning city views and premium finishes throughout.',
    features: ['Gym Access', '24/7 Security', 'Parking', 'Elevator', 'Air Conditioning', 'Balcony'],
    images: []
  },
  {
    id: '3',
    title: 'Executive Office Suite',
    location: 'Port Harcourt, Nigeria',
    address: 'Trans Amadi Industrial Layout',
    price: 1200000,
    type: 'Commercial',
    status: 'reserved',
    bedrooms: 0,
    bathrooms: 2,
    area: 320,
    description: 'Premium office space perfect for corporate headquarters or investment purposes.',
    features: ['Conference Room', 'Server Room', 'Kitchen', 'Parking', 'Security', 'Backup Power'],
    images: []
  },
  {
    id: '4',
    title: 'Family Home in Gated Estate',
    location: 'Ikeja, Nigeria',
    address: 'Ojodu Berger Estate, Ikeja',
    price: 1500000,
    type: 'House',
    status: 'available',
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    description: 'Beautiful family home in a secure gated estate with excellent amenities and neighborhood.',
    features: ['Estate Security', 'Children Play Area', 'Swimming Pool', 'Garden', 'BQ', 'Garage'],
    images: []
  }
];

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('properties');

  const property = properties.find(p => p.id === id);

  if (!property) {
    notFound();
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statusColors: Record<string, string> = {
    available: 'bg-green-100 text-green-800',
    sold: 'bg-red-100 text-red-800',
    reserved: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800',
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
              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[property.status]}`}>
                {property.status}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mt-4">{property.title}</h1>
              <div className="flex items-center text-primary-100 mt-2">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{property.location}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl md:text-4xl font-bold">{formatCurrency(property.price)}</p>
              <p className="text-primary-100 text-sm">{property.type}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Property Image */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-xl flex items-center justify-center">
            <span className="text-primary-600 dark:text-primary-300 text-xl">Property Image</span>
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
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{property.description}</p>
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
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{property.area}</span>
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
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary-600" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
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
                  <Button className="w-full" size="lg">
                    Contact Agent
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    Request Viewing
                  </Button>
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
