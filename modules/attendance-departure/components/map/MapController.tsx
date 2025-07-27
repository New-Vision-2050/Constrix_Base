"use client";

import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface MapControllerProps {
  isFullScreen: boolean;
  setMapRef: (map: L.Map) => void;
}

/**
 * Controller component for managing map instance and functionality
 * Handles map reference and size adjustments when fullscreen changes
 */
const MapController: React.FC<MapControllerProps> = ({ isFullScreen, setMapRef }) => {
  const map = useMap();
  
  // Save map reference when component mounts
  useEffect(() => {
    setMapRef(map);
  }, [map, setMapRef]);

  // Adjust map size when fullscreen state changes
  useEffect(() => {
    // When the size changes, we adjust the map immediately
    map.invalidateSize();
  }, [isFullScreen, map, setMapRef]);

  return null;
};

export default MapController;
