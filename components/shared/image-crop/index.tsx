"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ImageCropOptions {
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  aspect?: number;
  unit?: "px" | "%";
  locked?: boolean;
}

export interface ImageCropProps {
  image: string | File | null;
  croppedImage: string | null;
  onCropChange: (croppedImage: string | null) => void;
  options?: ImageCropOptions;
  className?: string;
  cropEditorClassName?: string;
  resultClassName?: string;
}

function getCroppedImg(
  image: HTMLImageElement,
  pixelCrop: PixelCrop,
  maxWidth?: number,
  maxHeight?: number,
): Promise<string> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Validate pixelCrop
  if (
    !pixelCrop ||
    pixelCrop.width <= 0 ||
    pixelCrop.height <= 0 ||
    !Number.isFinite(pixelCrop.width) ||
    !Number.isFinite(pixelCrop.height)
  ) {
    throw new Error("Invalid crop dimensions");
  }

  // Get the displayed image dimensions
  const displayedWidth = image.clientWidth;
  const displayedHeight = image.clientHeight;
  
  // Get the natural image dimensions
  const naturalWidth = image.naturalWidth;
  const naturalHeight = image.naturalHeight;

  // Safety checks
  if (!displayedWidth || !displayedHeight || !naturalWidth || !naturalHeight) {
    throw new Error("Image dimensions are not available");
  }

  // Calculate the scale factor between displayed and natural size
  const scaleX = naturalWidth / displayedWidth;
  const scaleY = naturalHeight / displayedHeight;

  // Convert crop coordinates from displayed size to natural size
  const cropX = pixelCrop.x * scaleX;
  const cropY = pixelCrop.y * scaleY;
  const cropWidth = pixelCrop.width * scaleX;
  const cropHeight = pixelCrop.height * scaleY;

  // Calculate the output scale factor if maxWidth or maxHeight is specified
  let outputScale = 1;
  if (maxWidth && cropWidth > maxWidth) {
    outputScale = maxWidth / cropWidth;
  }
  if (maxHeight && cropHeight > maxHeight) {
    const heightScale = maxHeight / cropHeight;
    outputScale = Math.min(outputScale, heightScale);
  }

  const outputWidth = cropWidth * outputScale;
  const outputHeight = cropHeight * outputScale;

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  // Draw the cropped portion from the natural image
  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    outputWidth,
    outputHeight,
  );

  // Convert canvas to base64 data URL
  try {
    const base64Image = canvas.toDataURL("image/png", 1);
    return Promise.resolve(base64Image);
  } catch (error) {
    return Promise.reject(new Error("Failed to convert canvas to image"));
  }
}

export default function ImageCrop({
  image,
  croppedImage,
  onCropChange,
  options = {},
  className,
  cropEditorClassName,
  resultClassName,
}: ImageCropProps) {
  const {
    maxWidth,
    maxHeight,
    minWidth = 10,
    minHeight = 10,
    aspect,
    unit = "%",
    locked = false,
  } = options;

  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [maxCropPx, setMaxCropPx] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [minCropPx, setMinCropPx] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Convert image prop to src string
  useEffect(() => {
    if (!image) {
      setImgSrc(null);
      setMaxCropPx(null);
      setMinCropPx(null);
      return;
    }

    if (typeof image === "string") {
      setImgSrc(image);
    } else if (image instanceof File) {
      const reader = new FileReader();
      reader.onload = () => {
        setImgSrc(reader.result as string);
      };
      reader.readAsDataURL(image);
    }
  }, [image]);

  // Initialize crop and compute max crop size in displayed pixels when image loads
  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      const { naturalWidth, naturalHeight } = img;
      const displayedWidth = img.clientWidth;
      const displayedHeight = img.clientHeight;

      // Calculate scale factors between displayed and natural size
      const scaleX = naturalWidth / displayedWidth;
      const scaleY = naturalHeight / displayedHeight;

      // Compute max crop size in displayed pixels so selection cannot exceed maxWidth/maxHeight (output)
      let computedMaxCropPx: { width: number; height: number } | null = null;
      if (
        maxWidth != null &&
        maxHeight != null &&
        displayedWidth > 0 &&
        displayedHeight > 0 &&
        naturalWidth > 0 &&
        naturalHeight > 0
      ) {
        computedMaxCropPx = {
          width: Math.floor(maxWidth / scaleX),
          height: Math.floor(maxHeight / scaleY),
        };
        setMaxCropPx(computedMaxCropPx);
      } else {
        setMaxCropPx(null);
      }

      // Compute min crop size in displayed pixels
      let computedMinCropPx: { width: number; height: number } | null = null;
      if (
        minWidth != null &&
        minHeight != null &&
        displayedWidth > 0 &&
        displayedHeight > 0 &&
        naturalWidth > 0 &&
        naturalHeight > 0
      ) {
        computedMinCropPx = {
          width: Math.ceil(minWidth / scaleX),
          height: Math.ceil(minHeight / scaleY),
        };
        setMinCropPx(computedMinCropPx);
      } else {
        setMinCropPx(null);
      }

      // Calculate initial crop size respecting constraints
      let initialCropWidth = displayedWidth * 0.9; // Start with 90% of displayed width
      let initialCropHeight = displayedHeight * 0.9;

      // Apply max constraints (in displayed pixels)
      if (computedMaxCropPx) {
        initialCropWidth = Math.min(initialCropWidth, computedMaxCropPx.width);
        initialCropHeight = Math.min(
          initialCropHeight,
          computedMaxCropPx.height,
        );
      }

      // Apply min constraints (in displayed pixels)
      if (computedMinCropPx) {
        initialCropWidth = Math.max(initialCropWidth, computedMinCropPx.width);
        initialCropHeight = Math.max(initialCropHeight, computedMinCropPx.height);
      }

      // Ensure crop doesn't exceed displayed dimensions
      initialCropWidth = Math.min(initialCropWidth, displayedWidth);
      initialCropHeight = Math.min(initialCropHeight, displayedHeight);

      let initialCrop: Crop;

      if (aspect) {
        // For aspect ratio crops, calculate size that fits within constraints
        let cropWidth = initialCropWidth;
        let cropHeight = cropWidth / aspect;

        // If height exceeds limit, recalculate from height
        if (cropHeight > initialCropHeight) {
          cropHeight = initialCropHeight;
          cropWidth = cropHeight * aspect;
        }

        // Ensure we're still within bounds after aspect adjustment
        if (computedMaxCropPx) {
          if (cropWidth > computedMaxCropPx.width) {
            cropWidth = computedMaxCropPx.width;
            cropHeight = cropWidth / aspect;
          }
          if (cropHeight > computedMaxCropPx.height) {
            cropHeight = computedMaxCropPx.height;
            cropWidth = cropHeight * aspect;
          }
        }

        // Convert to percentage if needed
        if (unit === "%") {
          initialCrop = centerCrop(
            {
              unit: "%",
              width: (cropWidth / displayedWidth) * 100,
              height: (cropHeight / displayedHeight) * 100,
            },
            displayedWidth,
            displayedHeight,
          );
        } else {
          initialCrop = centerCrop(
            {
              unit: "px",
              width: cropWidth,
              height: cropHeight,
            },
            displayedWidth,
            displayedHeight,
          );
        }
      } else {
        // No aspect ratio - use calculated dimensions
        if (unit === "%") {
          initialCrop = {
            unit: "%",
            x: 5,
            y: 5,
            width: (initialCropWidth / displayedWidth) * 100,
            height: (initialCropHeight / displayedHeight) * 100,
          };
        } else {
          initialCrop = {
            unit: "px",
            x: 10,
            y: 10,
            width: initialCropWidth,
            height: initialCropHeight,
          };
        }
      }

      setCrop(initialCrop);
    },
    [aspect, unit, maxWidth, maxHeight, minWidth, minHeight],
  );

  // Update min/max crop size when image element is resized (e.g. window resize)
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const updateCropConstraints = () => {
      const displayedWidth = img.clientWidth;
      const displayedHeight = img.clientHeight;
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      
      if (
        displayedWidth > 0 &&
        displayedHeight > 0 &&
        naturalWidth > 0 &&
        naturalHeight > 0
      ) {
        const scaleX = naturalWidth / displayedWidth;
        const scaleY = naturalHeight / displayedHeight;
        
        // Update max crop constraints
        if (maxWidth != null && maxHeight != null) {
          setMaxCropPx({
            width: Math.floor(maxWidth / scaleX),
            height: Math.floor(maxHeight / scaleY),
          });
        }
        
        // Update min crop constraints
        if (minWidth != null && minHeight != null) {
          setMinCropPx({
            width: Math.ceil(minWidth / scaleX),
            height: Math.ceil(minHeight / scaleY),
          });
        }
      }
    };

    const observer = new ResizeObserver(updateCropConstraints);
    observer.observe(img);
    return () => observer.disconnect();
  }, [imgSrc, maxWidth, maxHeight, minWidth, minHeight]);

  // Generate cropped image when crop is completed
  useEffect(() => {
    if (!completedCrop || !imgRef.current || !imgSrc) {
      return;
    }

    // Validate completedCrop has valid dimensions
    if (
      completedCrop.width <= 0 ||
      completedCrop.height <= 0 ||
      !Number.isFinite(completedCrop.width) ||
      !Number.isFinite(completedCrop.height)
    ) {
      console.warn("Invalid crop dimensions, skipping crop generation");
      return;
    }

    const generateCroppedImage = async () => {
      try {
        setIsLoading(true);
        const croppedImageUrl = await getCroppedImg(
          imgRef.current!,
          completedCrop,
          maxWidth,
          maxHeight,
        );
        onCropChange(croppedImageUrl);
      } catch (error) {
        console.error("Error generating cropped image:", error);
        // Don't call onCropChange(null) on error to preserve previous state
      } finally {
        setIsLoading(false);
      }
    };

    generateCroppedImage();
  }, [completedCrop, imgSrc, maxWidth, maxHeight, onCropChange]);

  if (!imgSrc) {
    return (
      <div
        className={cn(
          "flex items-center justify-center p-8 border border-dashed rounded-lg",
          className,
        )}
      >
        <p className="text-muted-foreground">No image provided</p>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
      {/* Crop Editor Section */}
      <Card className={cn("overflow-hidden", cropEditorClassName)}>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-4">Crop Editor</h3>
          <div className="relative w-full">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              minWidth={minCropPx?.width}
              minHeight={minCropPx?.height}
              maxWidth={maxCropPx?.width}
              maxHeight={maxCropPx?.height}
              locked={locked}
              className="max-w-full"
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                style={{
                  maxWidth: "100%",
                  maxHeight: "400px",
                  objectFit: "contain",
                }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </div>
          {maxWidth && maxHeight && (
            <p className="text-xs text-muted-foreground mt-2">
              Max size: {maxWidth} × {maxHeight}px
            </p>
          )}
        </CardContent>
      </Card>

      {/* Result Preview Section */}
      <Card className={cn("overflow-hidden", resultClassName)}>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-4">Result Preview</h3>
          <div className="relative w-full min-h-[200px] flex items-center justify-center border border-dashed rounded-lg bg-muted/50">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Processing...</p>
              </div>
            ) : croppedImage ? (
              <img
                src={croppedImage}
                alt="Cropped result"
                style={{
                  maxWidth: "100%",
                  maxHeight: "400px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Crop the image to see preview
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
