"use client";

import { useState } from "react";
import OptimizedImage from "./optimized-image";
import { cn } from "@/lib/utils";

interface StableImageProps {
  src: string;
  alt: string;
  aspectRatio?: "square" | "video" | "portrait" | "landscape" | number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
}

export default function StableImage({
  src,
  alt,
  aspectRatio = "square",
  className,
  priority = false,
  quality = 75,
  sizes,
}: StableImageProps) {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // تحديد نسبة العرض إلى الارتفاع
  const getAspectRatio = () => {
    if (typeof aspectRatio === "number") return aspectRatio;
    
    switch (aspectRatio) {
      case "square":
        return 1;
      case "video":
        return 16 / 9;
      case "portrait":
        return 3 / 4;
      case "landscape":
        return 4 / 3;
      default:
        return 1;
    }
  };

  const ratio = getAspectRatio();

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        aspectRatio: ratio,
        width: "100%",
      }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={quality}
        sizes={sizes}
        className="object-cover"
        onLoad={(event: React.SyntheticEvent<HTMLImageElement>) => {
          const img = event.target as HTMLImageElement;
          setDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        }}
      />
    </div>
  );
}
