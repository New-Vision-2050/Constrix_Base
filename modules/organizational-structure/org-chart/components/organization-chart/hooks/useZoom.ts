import { RefObject, useCallback, useState } from 'react'
import { useLocale } from 'next-intl'

interface UseZoomOptions {
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  step?: number;
  setPan?: ({x:number, y:number})=>void
  pan?: {x:number, y:number}
}

export function useZoom(params : UseZoomOptions) {
  let {
    initialZoom = 1,
    minZoom = 0.5,
    maxZoom = 2.0,
    step = 0.1,
    setPan,
    pan = {x:0,y:0}
  } = params
  const locale = useLocale()
  const [zoomLevel, setZoomLevel] = useState<number>(initialZoom)

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + step, maxZoom))
    // setPan({ x: 0, y: 0 })
  }

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - step, minZoom))
    // setPan({ x: 0, y: 0 })
  }

  const setZoom = (value: number | number[]) => {
    const newZoom = Array.isArray(value) ? value[0] : value
    setZoomLevel(Math.max(minZoom, Math.min(maxZoom, newZoom)))
    // setPan({ x: 0, y: 0 })
  }

  const zoomSensitivity = 0.0015;
  const handleWheelZoom = useCallback((e: WheelEvent, containerRef: RefObject<HTMLDivElement>) => {
    if (!containerRef.current) return;
    e.preventDefault();
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const prevZoom = zoomLevel;
    let newZoom = prevZoom * (1 - e.deltaY * zoomSensitivity);
    newZoom = Math.min(maxZoom, Math.max(minZoom, newZoom));

    const contentX = (mouseX - pan.x) / prevZoom;
    const contentY = (mouseY - pan.y) / prevZoom;
    const newPanX = pan.x - contentX * (newZoom - prevZoom);
    const newPanY = pan.y - contentY * (newZoom - prevZoom);
    setZoomLevel(newZoom);
    setPan({ x: newPanX, y: newPanY });
  }, [zoomLevel, pan]);

  const zoomStyle = {
    // transformOrigin: '0 0', // top-left
    transformOrigin: (pan?.x === 0 && pan?.y === 0) ? `top ${locale === 'ar' ? 'right' : 'left'}`: '0 0',
    transform: `translate(${pan?.x??0}px, ${pan?.y??0}px) scale(${zoomLevel})`,
    transition: 'transform 0s',
    willChange: 'transform',
    touchAction: 'none',
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
  }
}
