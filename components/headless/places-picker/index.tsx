import React, { useRef, useCallback, useState, ComponentProps } from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  Autocomplete,
  Libraries,
} from "@react-google-maps/api";

const libraries: Libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};
const defaultCenter = { lat: 25.276987, lng: 55.296249 }; // Example: Dubai

export type GoogleMapPickerValue = {
  address: string;
  lat?: number;
  lng?: number;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  [key: string]: string | number | undefined;
};

type Props = {
  onPick: (value: GoogleMapPickerValue) => void;
  mapProps?: Partial<ComponentProps<typeof GoogleMap>>;
};

function extractAddressComponents(
  place: google.maps.places.PlaceResult
): GoogleMapPickerValue {
  const result: GoogleMapPickerValue = {
    address: place.formatted_address || "",
    lat: place.geometry?.location?.lat(),
    lng: place.geometry?.location?.lng(),
  };
  if (!place.address_components) return result;
  for (const comp of place.address_components) {
    if (comp.types.includes("locality")) result.city = comp.long_name;
    if (comp.types.includes("administrative_area_level_1"))
      result.state = comp.long_name;
    if (comp.types.includes("country")) result.country = comp.long_name;
    if (comp.types.includes("postal_code")) result.postalCode = comp.long_name;
    // Add more as needed
  }
  return result;
}

const PlacesPicker: React.FC<Props> = ({ onPick, mapProps }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      
      // Set marker immediately
      setMarker({ lat, lng });
      
      // Try to geocode, but don't fail if it doesn't work
      try {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: e.latLng }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const addressData = extractAddressComponents(results[0]);
            addressData.lat = lat;
            addressData.lng = lng;
            onPick(addressData);
          } else {
            // Even if geocoding fails, still send lat/lng
            console.warn("Geocoding failed:", status);
            onPick({
              address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
              lat,
              lng,
            });
          }
        });
      } catch (error) {
        console.error("Geocoding error:", error);
        // Still send lat/lng even if geocoding fails
        onPick({
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          lat,
          lng,
        });
      }
    },
    [onPick]
  );

  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place && place.geometry && place.geometry.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setMarker({ lat, lng });
      onPick(extractAddressComponents(place));
      map?.panTo({ lat, lng });
    }
  };

  if (!isLoaded) return <div>Loading map…</div>;

  return (
    <div>
      <Autocomplete
        onLoad={(ac) => (autocompleteRef.current = ac)}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          type="text"
          placeholder="Search address"
          style={{ width: "100%", padding: 8, marginBottom: 8, zIndex: 9999 }}
        />
      </Autocomplete>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={marker || defaultCenter}
        zoom={marker ? 16 : 10}
        onClick={onMapClick}
        onLoad={setMap}
        {...mapProps}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </div>
  );
};

export default PlacesPicker;
