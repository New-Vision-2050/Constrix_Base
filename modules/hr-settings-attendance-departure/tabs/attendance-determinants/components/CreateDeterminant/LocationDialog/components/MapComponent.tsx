import React, { useMemo } from "react";
// @ts-ignore
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// @ts-ignore
import L from "leaflet";
import "./MapComponent.css";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  selectedBranch: string;
  isDefaultLocation: boolean;
  latitude: string;
  longitude: string;
  onMapClick: (latitude: string, longitude: string) => void;
}

// Component to handle map click events
function MapClickHandler({ onMapClick }: { onMapClick: (lat: string, lng: string) => void }) {
  useMapEvents({
    click: (e: any) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat.toFixed(4), lng.toFixed(4));
    },
  });
  return null;
}

export default function MapComponent({
  selectedBranch,
  isDefaultLocation,
  latitude,
  longitude,
  onMapClick,
}: MapComponentProps) {
  
  // Convert coordinates to numbers
  const position = useMemo(() => {
    const lat = parseFloat(latitude) || 24.7136;
    const lng = parseFloat(longitude) || 46.6753;
    return [lat, lng] as [number, number];
  }, [latitude, longitude]);
  
  // Custom marker icon for selected location
  const customIcon = useMemo(() => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 24px; 
          height: 24px; 
          background-color: #ec4899; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          <div style="
            width: 8px; 
            height: 8px; 
            background-color: white; 
            border-radius: 50%;
          "></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  }, []);
  return (
    <div className="mb-6">
      <div className="rounded-lg h-64 relative overflow-hidden">
        {/* @ts-ignore */}
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
        >
          {/* @ts-ignore */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* @ts-ignore */}
          <Marker position={position} icon={customIcon} />
          
          <MapClickHandler onMapClick={onMapClick} />
        </MapContainer>
        
        {/* Default Location Badge */}
        {isDefaultLocation && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000]">
            <div className="bg-gray-800 bg-opacity-80 text-white px-3 py-1 rounded-full text-sm">
              الموقع الافتراضي
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
