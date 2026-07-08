import type { Libraries } from "@react-google-maps/api";

export const GOOGLE_MAPS_LIBRARIES: Libraries = ["places", "geometry"];

export const GOOGLE_MAPS_LOADER_OPTIONS = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  libraries: GOOGLE_MAPS_LIBRARIES,
};
