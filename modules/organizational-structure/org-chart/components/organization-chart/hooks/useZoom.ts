
import { RefObject, useState } from 'react'
import { useLocale } from "next-intl";

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
  const locale = useLocale();
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

  const handleWheelZoom = (e: WheelEvent, containerRef?: RefObject<HTMLDivElement>) => {
    // if (!e.ctrlKey) return;
    e.preventDefault()
    const ZOOM_LEVELS = [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5]
    const dir = -Math.sign(e.deltaY) // -1 = down (zoom out), 1 = up (zoom in)

    setZoomLevel((prevZoom) => {
      const currentIndex = ZOOM_LEVELS.findIndex((z) => z === prevZoom)
      let newIndex = currentIndex + dir
      if (newIndex < 0) newIndex = 0
      if (newIndex >= ZOOM_LEVELS.length) newIndex = ZOOM_LEVELS.length - 1
      if(containerRef?.current) {
        setTimeout(() => {
          if(containerRef?.current) {
            containerRef.current.style.textIndent = '0'
          }
        }, 0)
        containerRef.current.style.textIndent = '0.01px'
      }
      return ZOOM_LEVELS[newIndex]
    })
  }

  const zoomStyle = {
    transform: `scale(${zoomLevel})`,
    transformOrigin: `${locale === "ar"? 'right': 'left'} top`,
    transition: 'transform 0.3s ease'
  };

  return {
    zoomLevel, // Return as a number
    zoomIn,
    zoomOut,
    setZoom,
    handleWheelZoom,
    zoomStyle,
    minZoom,
    maxZoom,
    step
  };
}
