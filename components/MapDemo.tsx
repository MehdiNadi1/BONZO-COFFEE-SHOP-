"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Leaflet and React-Leaflet depend on 'window', so we must import them dynamically
const AdvancedMap = dynamic(
  () => import('@/components/ui/interactive-map').then((mod) => mod.AdvancedMap),
  { 
    ssr: false,
    loading: () => <div style={{ height: '600px', width: '100%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifySelf: 'center', color: '#6b705c' }}>Initializing Map Intelligence...</div>
  }
);

export default function MapDemo() {
  const [markers, setMarkers] = useState([
    {
      id: 1,
      position: [31.5130, -9.7712], // Essaouira coordinates near Medina
      color: 'green',
      size: 'large',
      popup: {
        title: 'BONZO Coffee Shop',
        content: '5 Rue Basra, Av. Casablanca. The vibe deal headquarters.',
        image: '/about-outside.jpg'
      }
    }
  ]);

  const circles = [
    {
      id: 1,
      center: [31.5130, -9.7712],
      radius: 300,
      style: { color: '#00ff41', fillOpacity: 0.1, weight: 1 },
      popup: 'Bonzo Signal Radius'
    }
  ];

  const handleMarkerClick = (marker: any) => {
    console.log('Marker clicked:', marker);
  };

  const handleMapClick = (latlng: any) => {
    console.log('Map clicked at:', latlng);
  };

  return (
    <div className="w-full h-full bg-[#050505] rounded-lg overflow-hidden border border-[#1a1a1a] shadow-2xl">
      <AdvancedMap
        center={[31.5130, -9.7712]}
        zoom={16}
        markers={markers}
        circles={circles}
        onMarkerClick={handleMarkerClick}
        onMapClick={handleMapClick}
        enableClustering={true}
        enableSearch={true}
        enableControls={true}
        style={{ height: '600px', width: '100%' }}
      />
    </div>
  );
};
