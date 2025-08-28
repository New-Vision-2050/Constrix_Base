import React, { useMemo, useRef } from "react";
// @ts-ignore
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// @ts-ignore
import L from "leaflet";
import "./MapComponent.css";
import MapSearchControl from "./MapSearchControl";
import { useFormStore } from "@/modules/form-builder";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  onMapClick: (latitude: string, longitude: string, locationInfo?: any) => void;
  formId: string;
}

export interface LocationInfo {
  city?: string;
  district?: string;
  street?: string;
  fullAddress?: string;
}

// Function to get location information from coordinates using reverse geocoding
async function getLocationInfo(lat: number, lng: number): Promise<LocationInfo> {
  try {
    // Using Nominatim API for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await response.json();
    
    // Extract relevant information
    const address = data.address || {};
    const locationInfo: LocationInfo = {
      city: address.city || address.town || address.village || address.state,
      district: address.suburb || address.neighbourhood || address.quarter,
      street: address.road || address.street,
      fullAddress: data.display_name,
    };

    // Log location information
    console.log('Location Information:', locationInfo);
    
    return locationInfo;
  } catch (error) {
    console.error('Error fetching location info:', error);
    return {};
  }
}

// Component to handle map click events
function MapClickHandler({ onMapClick }: { onMapClick: (lat: string, lng: string, locationInfo?: LocationInfo) => void }) {
  useMapEvents({
    click: async (e: any) => {
      const { lat, lng } = e.latlng;
      const latStr = lat.toFixed(4);
      const lngStr = lng.toFixed(4);
      
      // Get location information and log it
      const locationInfo = await getLocationInfo(lat, lng);
      
      // Pass coordinates and location info to the parent component
      onMapClick(latStr, lngStr, locationInfo);
    },
  });
  return null;
}

export default function AddressMapComponent({
  formId,
  onMapClick,
}: MapComponentProps) {
  // Default coordinates for Riyadh city, used only when no coordinates are provided
  const DEFAULT_RIYADH_LAT = "24.7136";
  const DEFAULT_RIYADH_LNG = "46.6753";

  // get latitude and longitude from form
  const values = useFormStore((state) => state.forms[formId]?.values);
  const latitude = values?.latitude;
  const longitude = values?.longitude;
  
  const latStr = latitude || DEFAULT_RIYADH_LAT;
  const lngStr = longitude || DEFAULT_RIYADH_LNG;
  
  // Convert coordinates to numbers
  const position = useMemo(() => {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    return [lat, lng] as [number, number];
  }, [latStr, lngStr]);
  
  // Reference to the map instance
  const mapRef = useRef(null);
  
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
          ref={mapRef}
          // @ts-ignore - Using whenReady to get map instance - react-leaflet type defs can be inconsistent
          whenReady={({ target }: { target: any }) => {
            mapRef.current = target;
          }}
        >
          {/* @ts-ignore */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* @ts-ignore */}
          <Marker key={position.toString()} position={position} icon={customIcon} />
          
          <MapClickHandler onMapClick={onMapClick} />
          
          <MapSearchControl
            onLocationSelected={async (lat: string, lng: string) => {
              // Get location information when a location is selected from search
              const locationInfo = await getLocationInfo(parseFloat(lat), parseFloat(lng));
              onMapClick(lat, lng, locationInfo);
            }}
            position="topleft"
            style="bar"
            autoComplete={true}
            autoClose={true}
          />
        </MapContainer>
      </div>
    </div>
  );
}
