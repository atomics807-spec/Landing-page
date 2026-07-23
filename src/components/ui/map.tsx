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

  useEffect(() => {
    // Dynamically load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    // Dynamically load Leaflet JS
    if (!window.L && mapRef.current && !mapInstanceRef.current) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/ZuhVM9K23Z65x5g1zc=';
      script.crossOrigin = '';
      script.onload = () => {
        initializeMap();
      };
      document.body.appendChild(script);
    } else if (window.L && mapRef.current && !mapInstanceRef.current) {
      initializeMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const initializeMap = () => {
    if (!window.L || !mapRef.current || mapInstanceRef.current) return;

    const L = window.L;

    // Create map instance
    const map = L.map(mapRef.current, {
      center: [OFFICE_COORDINATES.lat, OFFICE_COORDINATES.lng],
      zoom: 15,
      scrollWheelZoom: true,
      dragging: true,
      zoomControl: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Custom marker icon
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 48px;
          height: 48px;
          background: #0d9488;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 3px solid white;
        ">
          <div style="
            transform: rotate(45deg);
            color: white;
            font-size: 20px;
          ">📍</div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 48],
      popupAnchor: [0, -48],
    });

    // Add marker with popup
    const marker = L.marker([OFFICE_COORDINATES.lat, OFFICE_COORDINATES.lng], {
      icon: customIcon,
    }).addTo(map);

    // Add popup
    marker.bindPopup(`
      <div style="text-align: center; padding: 8px;">
        <strong style="font-size: 14px; color: #0d9488;">Paraysco Consulting</strong>
        <br/>
        <span style="font-size: 12px; color: #666;">Bota Middle Farms, Limbe</span>
        <br/>
        <span style="font-size: 11px; color: #999;">South West Region, Cameroon</span>
        <br/>
        <a href="https://www.openstreetmap.org/directions?from=&to=${OFFICE_COORDINATES.lat},${OFFICE_COORDINATES.lng}" 
           target="_blank" 
           style="color: #0d9488; font-size: 12px; text-decoration: none; margin-top: 4px; display: inline-block;">
           Get Directions →
        </a>
      </div>
    `, {
      maxWidth: 200,
      className: 'custom-popup',
    });

    // Open popup by default
    marker.openPopup();

    mapInstanceRef.current = map;
    setIsLoaded(true);
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${OFFICE_COORDINATES.lat},${OFFICE_COORDINATES.lng}`;
    window.open(url, '_blank');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 100);
    }
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : ''} ${className}`}>
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[300px] rounded-xl overflow-hidden"
        style={{ zIndex: 1 }}
      />

      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">Loading map...</p>
          </div>
        </div>
      )}

      {/* Map Controls */}
      {isLoaded && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-[1000]">
          <Button
            onClick={openInGoogleMaps}
            size="sm"
            variant="secondary"
            className="shadow-lg bg-white dark:bg-gray-800 hover:bg-gray-100"
          >
            <Navigation className="h-4 w-4 mr-1" />
            Directions
          </Button>
          <Button
            onClick={toggleFullscreen}
            size="sm"
            variant="secondary"
            className="shadow-lg bg-white dark:bg-gray-800 hover:bg-gray-100"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Location Label */}
      {isLoaded && (
        <div className="absolute top-4 left-4 z-[1000] bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Bota Middle Farms, Limbe
            </span>
          </div>
        </div>
      )}

      {/* Close Fullscreen Button */}
      {isFullscreen && (
        <Button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-[1001]"
          variant="secondary"
        >
          Close
        </Button>
      )}

      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
        }
        .custom-popup .leaflet-popup-content {
          margin: 12px;
        }
        .custom-marker {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
}

// Add type declaration for Leaflet
declare global {
  interface Window {
    L: any;
  }
}
