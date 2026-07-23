'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Maximize2, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Coordinates for Bota Middle Farms, Limbe, Cameroon
const OFFICE_COORDINATES = {
  lat: 4.0087,
  lng: 9.1952,
};

interface MapProps {
  className?: string;
}

export function InteractiveMap({ className = '' }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    let isMounted = true;

    const initMap = async () => {
      try {
        // Wait for Leaflet to be available (it's imported via CSS, so L should be global)
        // Actually, we need to load the Leaflet JS
        if (typeof window !== 'undefined') {
          // Load Leaflet JS if not already loaded
          if (!(window as any).L) {
            await new Promise<void>((resolve, reject) => {
              const script = document.createElement('script');
              script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
              script.onload = () => resolve();
              script.onerror = () => reject(new Error('Failed to load Leaflet'));
              document.head.appendChild(script);
            });
          }

          if (!isMounted || !mapRef.current) return;

          const L = (window as any).L;

          // Create map
          const map = L.map(mapRef.current, {
            center: [OFFICE_COORDINATES.lat, OFFICE_COORDINATES.lng],
            zoom: 15,
            scrollWheelZoom: false,
            dragging: true,
            zoomControl: true,
          });

          // Add tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19,
          }).addTo(map);

          // Add marker
          const marker = L.marker([OFFICE_COORDINATES.lat, OFFICE_COORDINATES.lng]).addTo(map);
          
          marker.bindPopup(`
            <div style="min-width: 150px; padding: 4px;">
              <strong style="color: #0d9488; font-size: 14px;">Paraysco Consulting</strong><br/>
              <span style="font-size: 12px; color: #666;">Bota Middle Farms, Limbe</span><br/>
              <span style="font-size: 11px; color: #999;">Cameroon</span>
            </div>
          `);

          // Open popup after short delay
          setTimeout(() => {
            if (map && !map._closed) {
              marker.openPopup();
            }
          }, 1000);

          mapInstanceRef.current = map;

          if (isMounted) {
            setIsLoaded(true);
          }
        }
      } catch (err) {
        console.error('Map initialization error:', err);
        if (isMounted) {
          setError('Unable to load map');
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initMap, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // Ignore cleanup errors
        }
        mapInstanceRef.current = null;
      }
      hasInitialized.current = false;
    };
  }, []);

  const openInGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${OFFICE_COORDINATES.lat},${OFFICE_COORDINATES.lng}`,
      '_blank'
    );
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 200);
    }
  };

  if (error) {
    return (
      <div className={`relative bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center ${className}`} style={{ minHeight: 350 }}>
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm mb-3">{error}</p>
          <a 
            href={`https://www.google.com/maps?q=${OFFICE_COORDINATES.lat},${OFFICE_COORDINATES.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 text-sm hover:underline"
          >
            Open in Google Maps →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : ''} ${className}`} style={{ minHeight: 350 }}>
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-xl overflow-hidden"
        style={{ minHeight: 350, zIndex: 1 }}
      />

      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center" style={{ minHeight: 350 }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">Loading map...</p>
          </div>
        </div>
      )}

      {/* Controls */}
      {isLoaded && (
        <>
          {/* Directions Button */}
          <div className="absolute bottom-4 right-4 z-[400]">
            <Button
              onClick={openInGoogleMaps}
              size="sm"
              variant="secondary"
              className="shadow-lg bg-white dark:bg-gray-800 hover:bg-gray-100 gap-1.5"
            >
              <Navigation className="h-4 w-4" />
              Directions
            </Button>
          </div>

          {/* Location Badge */}
          <div className="absolute top-4 left-4 z-[400] bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Bota Middle Farms, Limbe
              </span>
            </div>
          </div>

          {/* Fullscreen Button */}
          <div className="absolute bottom-4 left-4 z-[400]">
            <Button
              onClick={toggleFullscreen}
              size="sm"
              variant="secondary"
              className="shadow-lg bg-white dark:bg-gray-800 hover:bg-gray-100"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}

      {/* Close Fullscreen */}
      {isFullscreen && (
        <Button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-[500]"
          variant="secondary"
        >
          Close
        </Button>
      )}
    </div>
  );
}
