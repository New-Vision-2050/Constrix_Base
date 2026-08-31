"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteIcon from "@mui/icons-material/Delete";
import FormLabel from "@/components/shared/FormLabel";
import { cn } from "@/lib/utils";

export interface NoCropImageUploadProps {
  label?: string;
  onChange: (file: File | null, base64Image: string | null) => void;
  previewImage?: string | null;
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  accept?: string;
  maxSize?: string;
  className?: string;
  compact?: boolean;
  fill?: boolean;
  hideDelete?: boolean;
  objectFit?: "contain" | "cover";
  id?: string;
  disableHover?: boolean;
  disableClick?: boolean;
}

export default function NoCropImageUpload({
  label,
  onChange,
  previewImage = null,
  loading = false,
  disabled = false,
  required = false,
  accept = "image/*",
  maxSize,
  className,
  compact = false,
  fill = false,
  hideDelete = false,
  objectFit = "contain",
  id,
  disableHover = false,
  disableClick = false,
}: NoCropImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(previewImage);

  useEffect(() => {
    if (previewImage) {
      setCurrentImage(previewImage);
    }
  }, [previewImage]);

  const handleButtonClick = useCallback(() => {
    if (disabled || loading) return;
    fileInputRef.current?.click();
  }, [disabled, loading]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file || !file.type.startsWith("image/")) {
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      if (maxSize) {
        const match = maxSize.match(/(\d+)\s*(MB|KB|GB)/i);
        if (match) {
          const size = parseInt(match[1], 10);
          const unit = match[2].toUpperCase();
          let bytes = size;
          if (unit === "KB") bytes *= 1024;
          else if (unit === "MB") bytes *= 1024 * 1024;
          else if (unit === "GB") bytes *= 1024 * 1024 * 1024;

          if (file.size > bytes) {
            if (typeof window !== "undefined") {
              window.alert(`حجم الملف يتجاوز ${maxSize}`);
            }
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
        }
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCurrentImage(base64);
        onChange(file, base64);
      };
      reader.readAsDataURL(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [maxSize, onChange],
  );

  const handleClear = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (disabled || loading) return;
      setCurrentImage(null);
      onChange(null, null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [disabled, loading, onChange],
  );

  return (
    <Box className={cn("w-full space-y-2", className)}>
      {label && <FormLabel required={required}>{label}</FormLabel>}

      <Box
        onClick={disableClick ? undefined : handleButtonClick}
        sx={{
          width: "100%",
          minHeight: fill ? 0 : compact ? { xs: 140, md: 160 } : { xs: 200, md: 260 },
          height: fill ? "100%" : !currentImage ? "auto" : compact ? { xs: 140, md: 160 } : "auto",
          border: fill ? "none" : compact ? "1px solid" : "2px dashed",
          borderColor: disabled || loading ? "action.disabled" : "divider",
          borderRadius: fill ? 0 : 2,
          bgcolor: fill ? "transparent" : "background.paper",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: disabled || loading ? "not-allowed" : disableClick ? "default" : "pointer",
          position: "relative",
          overflow: "hidden",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <input
          id={id}
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={disabled || loading}
          style={{ display: "none" }}
        />

        {!currentImage ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              p: compact ? 1 : 2,
            }}
          >
            <UploadCloud
              className={cn(
                "text-primary",
                compact ? "h-10 w-10 mb-1" : "h-16 w-16 mb-2",
              )}
            />
            <Typography
              variant="body1"
              className={cn("font-medium", compact ? "text-sm" : "text-base")}
              sx={{ color: "text.primary", mb: compact ? 0.5 : 1 }}
            >
              {loading ? "جاري الرفع..." : "قم بإرفاق المستند"}
            </Typography>
            {!loading && accept && accept !== "image/*" && (
              <Typography
                variant="caption"
                className="text-muted-foreground"
                sx={{ textAlign: "center", mb: compact ? 0.5 : 1, px: 1 }}
              >
                {`يسمح بتنسيق a: ${accept
                  .split(",")
                  .map((type) => {
                    const trimmed = type.trim().toLowerCase();
                    switch (trimmed) {
                      case "image/jpeg":
                      case "image/jpg":
                        return "JPG";
                      case "image/png":
                        return "PNG";
                      case "image/webp":
                        return "WEBP";
                      default:
                        return (
                          trimmed.split("/").pop()?.toUpperCase() || trimmed
                        );
                    }
                  })
                  .join(", ")}`}
              </Typography>
            )}
            {!loading && maxSize && !compact && (
              <Typography
                variant="caption"
                className="text-muted-foreground"
                sx={{ mb: 1 }}
              >
                {`الحد الأقصى للحجم: ${maxSize}`}
              </Typography>
            )}
            {!loading && (
              <Button
                type="button"
                size={compact ? "sm" : "default"}
                className={compact ? "mt-1" : "mt-4"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleButtonClick();
                }}
                disabled={disabled || loading}
              >
                إرفاق
              </Button>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: fill || compact ? 0 : 2,
            }}
          >
            <Box
              component="img"
              src={currentImage}
              alt={label || "Image"}
              sx={{
                maxWidth: "100%",
                maxHeight: fill || compact ? "100%" : { xs: 240, md: 360 },
                width: fill || compact ? "100%" : "auto",
                height: fill || compact ? "100%" : "auto",
                objectFit,
                borderRadius: fill || compact ? 0 : 1,
              }}
            />

            {!loading && !disableHover && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.2s ease-in-out",
                  "&:hover": { opacity: 1 },
                  pointerEvents: "none",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontWeight: 500 }}
                >
                  استبدال الصورة
                </Typography>
              </Box>
            )}

            {loading && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: "rgba(0, 0, 0, 0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontWeight: 500 }}
                >
                  جاري الرفع...
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {currentImage && !hideDelete && (
          <IconButton
            onClick={handleClear}
            disabled={disabled || loading}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": {
                bgcolor: "error.main",
                color: "white",
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
