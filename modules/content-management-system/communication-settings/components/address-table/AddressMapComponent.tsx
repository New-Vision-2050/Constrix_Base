"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Map click handler component
 * Captures user clicks on map to set coordinates
 */
function MapClickHandler({ onClick, disabled }: { onClick: (lat: number, lng: number) => void; disabled?: boolean }) {
  useMapEvents({
    click: (e: any) => {
      if (!disabled) {
        const { lat, lng } = e.latlng;
        onClick(lat, lng);
      }
    },
  });
  return null;
}

interface AddressMapComponentProps {
  latitude: string;
  longitude: string;
  onLocationSelect: (lat: string, lng: string) => void;
  disabled?: boolean;
}

/**
 * AddressMapComponent - Interactive map for address selection
 * Allows users to click on map to select coordinates
 */
export default function AddressMapComponent({
  latitude,
  longitude,
  onLocationSelect,
  disabled = false,
}: AddressMapComponentProps) {
  const mapRef = useRef<any>(null);

  // Parse coordinates or use default (Saudi Arabia center)
  const lat = parseFloat(latitude) || 24.7136;
  const lng = parseFloat(longitude) || 46.6753;
  const position: [number, number] = [lat, lng];

  // Custom marker icon
  const customIcon = L.divIcon({
    html: `<div style="background: #ec4899; width: 18px; height: 18px; border-radius: 50%;overflow: hidden;"></div>`,
  });

  // Update map center when coordinates change
  useEffect(() => {
    if (mapRef.current && latitude && longitude) {
      mapRef.current.setView(position, mapRef.current.getZoom());
    }
  }, [latitude, longitude]);

  const handleMapClick = (lat: number, lng: number) => {
    if (!disabled) {
      onLocationSelect(lat.toFixed(6), lng.toFixed(6));
    }
  };

  return (
    <div className="relative rounded-lg h-64 overflow-hidden border border-border">
      <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }} 
        ref={mapRef}
        dragging={!disabled}
        zoomControl={!disabled}
        scrollWheelZoom={!disabled}
        doubleClickZoom={!disabled}
        touchZoom={!disabled}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap' />
        <Marker position={position} icon={customIcon} />
        <MapClickHandler onClick={handleMapClick} disabled={disabled} />
      </MapContainer>
      
      {/* Overlay when disabled */}
      {disabled && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] cursor-not-allowed z-[1000] flex items-center justify-center">
          <div className="bg-background/80 px-4 py-2 rounded-lg text-sm font-medium">
            Map is disabled
          </div>
        </div>
      )}
    </div>
  );
}

