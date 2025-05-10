
import { useState } from "react";

interface UseZoomOptions {
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  step?: number;
}

export function useZoom({
                          initialZoom = 1,
                          minZoom = 0.5,
                          maxZoom = 2.0,
                          step = 0.1
                        }: UseZoomOptions = {}) {
  const [zoomLevel, setZoomLevel] = useState<number>(initialZoom);

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + step, maxZoom));
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - step, minZoom));
  };

  const setZoom = (value: number | number[]) => {
    const newZoom = Array.isArray(value) ? value[0] : value;
    setZoomLevel(Math.max(minZoom, Math.min(maxZoom, newZoom)));
  };

  const zoomStyle = {
    transform: `scale(${zoomLevel})`,
    transformOrigin: 'center top',
    transition: 'transform 0.3s ease'
  };

  return {
    zoomLevel, // Return as a number
    zoomIn,
    zoomOut,
    setZoom,
    zoomStyle,
    minZoom,
    maxZoom,
    step
  };
}
