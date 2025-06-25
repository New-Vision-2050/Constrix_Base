"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import type { Libraries } from "@react-google-maps/api";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/config/axios-config";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";
import { ServerSuccessResponse } from "@/types/ServerResponse";

// Zod schema for location validation
const locationSchema = z.object({
  longitude: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= -180 && num <= 180;
    },
    { message: "Longitude must be between -180 and 180" }
  ),
  latitude: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= -90 && num <= 90;
    },
    { message: "Latitude must be between -90 and 90" }
  ),
});

// Create types from the schema
type LocationFormValues = z.infer<typeof locationSchema>;

// Props interface for the component
interface LocationSelectorProps {
  onSave: (obj: Record<string, string | undefined>) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
  currentLocation?: {
    latitude: string;
    longitude: string;
  };
  inGeneral?: boolean;
  branchId?: string;
  companyId?: string;
  viewOnly?: boolean;
}

interface payloadSuccess {
  country: {
    id: string;
    name: string;
    status: number;
  };
  state: {
    id: string;
    name: string;
  };
  city: {
    id: string;
    name: string;
  };
  neighborhood: string;
  postal_code: string;
  route: string;
}

interface SearchResult {
  place_id: string;
  description: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

// The container style for the Google Map
const containerStyle = {
  width: "100%",
  height: "450px",
  borderRadius: "10px",
};

// Default center for the map (can be set to a default location)
const defaultCenter = {
  lat: 24.68096433866003,
  lng: 46.64794921875,
};

// Libraries to load with Google Maps
const libraries: Libraries = ["places"];

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onSave,
  initialLocation,
  currentLocation,
  inGeneral,
  branchId,
  companyId,
  viewOnly,
}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: LocationFormValues) => {
      const response = await apiClient.post<
        ServerSuccessResponse<payloadSuccess>
      >(
        "companies/company-profile/national-address",
        {
          lat: data.latitude,
          long: data.longitude,
        },
        {
          params: {
            ...(inGeneral && { in_general: true }),
            ...(branchId && { branch_id: branchId }),
            ...(companyId && { company_id: companyId }),
          },
        }
      );
      return response.data;
    },
  });

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [markerPosition, setMarkerPosition] =
    useState<google.maps.LatLngLiteral>(
      currentLocation
        ? { lat: parseFloat(currentLocation.latitude), lng: parseFloat(currentLocation.longitude) }
        : initialLocation
        ? { lat: initialLocation.latitude, lng: initialLocation.longitude }
        : defaultCenter
    );

  // React Hook Form setup with Zod validation
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      latitude: (currentLocation?.latitude || initialLocation?.latitude || defaultCenter.lat).toString(),
      longitude: (currentLocation?.longitude || initialLocation?.longitude || defaultCenter.lng).toString(),
    },
  });

  // Update form values when marker position changes
  useEffect(() => {
    setValue("latitude", markerPosition.lat.toString());
    setValue("longitude", markerPosition.lng.toString());
  }, [markerPosition, setValue]);

  // Handle map click to update marker position
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPosition = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setMarkerPosition(newPosition);
    }
  };

  // Handle form submission
  const onSubmit = async (data: LocationFormValues): Promise<void> => {
    const locationData = {
      latitude: String(parseFloat(data.latitude)),
      longitude: String(parseFloat(data.longitude)),
    };

    mutate(data, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (err: any) => {
        const errMessage =
          err?.response?.data?.message?.description ?? "خطآ في اختيار الموقع";
        setError("longitude", {
          message: errMessage,
        });
        console.log("error from mutation: ", errMessage);
      },
      onSuccess: (succ) => {
        const country_id = succ?.payload?.country?.id;
        const state_id = succ?.payload?.state?.id;
        const city_id = succ?.payload?.city?.id;
        const neighborhood_name = succ?.payload?.neighborhood;
        const postal_code = succ?.payload?.postal_code;
        const street_name = succ?.payload?.route;

        // On form submission, don't skip closing the dialog
        onSave({
          country_id,
          state_id,
          city_id,
          neighborhood_name,
          postal_code,
          street_name,
          ...locationData,
        });
      },
    });
  };

  const onLoad = (mapInstance: google.maps.Map): void => {
    setMap(mapInstance);

    // Prioritize currentLocation over initialLocation
    const locationToUse = currentLocation 
      ? {
          lat: parseFloat(currentLocation.latitude),
          lng: parseFloat(currentLocation.longitude),
        }
      : initialLocation
      ? {
          lat: initialLocation.latitude,
          lng: initialLocation.longitude,
        }
      : null;

    // If there's a location to use, center the map on it
    if (locationToUse && !isNaN(locationToUse.lat) && !isNaN(locationToUse.lng)) {
      mapInstance.panTo(locationToUse);
      mapInstance.setZoom(15);
    }
  };

  const onUnmount = (): void => {
    setMap(null);
  };

  // Custom search function using Google Places API
  const searchPlaces = useCallback(
    async (query: string) => {
      if (!query.trim() || !isLoaded || !window.google) return;

      try {
        const service = new window.google.maps.places.AutocompleteService();

        service.getPlacePredictions(
          {
            input: query,
            sessionToken: new window.google.maps.places.AutocompleteSessionToken(),
          },
          (predictions, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
              const results: SearchResult[] = predictions.map((prediction) => ({
                place_id: prediction.place_id,
                description: prediction.description,
              }));
              setSearchResults(results);
              setShowResults(true);
            } else {
              setSearchResults([]);
              setShowResults(false);
            }
          }
        );
      } catch (error) {
        console.error("Error searching places:", error);
        setSearchResults([]);
        setShowResults(false);
      }
    },
    [isLoaded]
  );

  // Handle search input change with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length > 1) {
        searchPlaces(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchPlaces]);

  // Handle selecting a search result
  const handleSelectPlace = useCallback(
    (placeId: string) => {
      if (!isLoaded || !window.google) return;

      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      service.getDetails(
        {
          placeId: placeId,
          fields: ['geometry'],
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            const newPosition = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };

            setMarkerPosition(newPosition);

            if (map) {
              map.panTo(newPosition);
              map.setZoom(15);
            }

            // Hide search results
            setShowResults(false);
            setSearchQuery("");
          }
        }
      );
    },
    [isLoaded, map]
  );

  const handleGetCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("الموقع الجغرافي غير مدعوم في هذا المتصفح");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMarkerPosition(newPosition);
        
        // Center the map on the new location
        if (map) {
          map.panTo(newPosition);
          map.setZoom(15);
        }
        
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "فشل في الحصول على الموقع الحالي";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "تم رفض الإذن للوصول إلى الموقع";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "الموقع غير متاح";
            break;
          case error.TIMEOUT:
            errorMessage = "انتهت مهلة الحصول على الموقع";
            break;
        }
        
        alert(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [map]);

  return (
    <>
      {!viewOnly && isLoaded && (
        <div className="mb-6">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="ابحث عن موقع"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 bg-[#1c1635] border border-[#2e2649] rounded-lg text-white text-right"
              dir="rtl"
              onBlur={() => {
                // Delay hiding results to allow clicking on them
                setTimeout(() => setShowResults(false), 200);
              }}
              onFocus={() => {
                if (searchResults.length > 0) {
                  setShowResults(true);
                }
              }}
            />

            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-[#1c1635] border border-[#2e2649] rounded-lg mt-1 max-h-60 overflow-y-auto z-10">
                {searchResults.map((result) => (
                  <div
                    key={result.place_id}
                    className="p-3 hover:bg-[#2e2649] cursor-pointer text-white text-right border-b border-[#2e2649] last:border-b-0"
                    onClick={() => handleSelectPlace(result.place_id)}
                  >
                    {result.description}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
            className="w-full"
          >
            <Navigation className="w-4 h-4 ml-2" />
            {isGettingLocation ? "جاري تحديد الموقع..." : "تحديد الموقع الحالي"}
          </Button>
        </div>
      )}
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-white text-right mb-2">خط العرض</label>
            <Controller
              name="longitude"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full p-3 bg-[#1c1635] border border-[#2e2649] rounded-lg text-white text-right"
                  dir="rtl"
                />
              )}
            />
            {errors.longitude && (
              <p className="text-red-500 text-right mt-1">
                {errors.longitude.message}
              </p>
            )}
          </div>

          <div className="flex-1">
            <label className="block text-white text-right mb-2">خط الطول</label>
            <Controller
              name="latitude"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full p-3 bg-[#1c1635] border border-[#2e2649] rounded-lg text-white text-right"
                  dir="rtl"
                />
              )}
            />
            {errors.latitude && (
              <p className="text-red-500 text-right mt-1">
                {errors.latitude.message}
              </p>
            )}
          </div>
        </div>

        <div className="mb-6">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={markerPosition}
              zoom={5}
              onClick={viewOnly ? undefined : handleMapClick}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: false,
              }}
            >
              <Marker
                position={markerPosition}
                draggable={!viewOnly}
                onDragEnd={(e) => {
                  if (e.latLng && !viewOnly) {
                    setMarkerPosition({
                      lat: e.latLng.lat(),
                      lng: e.latLng.lng(),
                    });
                  }
                }}
              />
            </GoogleMap>
          ) : (
            <div className="w-full h-[450px] bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-white">Loading Map...</p>
            </div>
          )}
        </div>

        {!viewOnly && (
          <div className="flex justify-center">
            <Button
              onClick={handleSubmit(onSubmit)}
              type="button"
              loading={isPending}
              className="w-1/4"
            >
              حفظ
            </Button>
          </div>
        )}
      </form>
    </>
  );
};

export default LocationSelector;
