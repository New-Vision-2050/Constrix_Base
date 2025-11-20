"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadButtonProps {
  onChange?: (file: File | null) => void;
  accept?: string;
  maxSize?: string; // e.g., "10MB"
  className?: string;
  disabled?: boolean;
  initialValue?: string | File | null;
  label?: string;
}

export default function FileUploadButton({
  onChange,
  accept = "*/*",
  maxSize,
  className = "",
  disabled = false,
  initialValue,
  label,
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);

  // Initialize upload ID on client side only
  useEffect(() => {
    setUploadId(`file-upload-${Math.random().toString(36).substring(2, 9)}`);
  }, []);

  // Handle initial value
  useEffect(() => {
    if (initialValue && !selectedFile) {
      if (initialValue instanceof File) {
        setSelectedFile(initialValue);
      } else if (typeof initialValue === "string") {
        // If it's a URL, we can't set it as a File, but we can show the filename
        // Extract filename from URL if possible
        const urlParts = initialValue.split("/");
        const filename = urlParts[urlParts.length - 1];
        // Create a dummy file object for display purposes
        // Note: This won't work for actual file operations, just for display
      }
    }
  }, [initialValue]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size if maxSize is provided
    if (maxSize) {
      const maxSizeBytes = parseSize(maxSize);
      if (file.size > maxSizeBytes) {
        alert(`File size exceeds the maximum allowed size of ${maxSize}`);
        e.target.value = "";
        return;
      }
    }

    setSelectedFile(file);
    onChange?.(file);
    e.target.value = ""; // Reset input to allow selecting the same file again
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    if (uploadId) {
      fileInputRef.current?.click();
    }
  };

  const parseSize = (sizeString: string): number => {
    const match = sizeString.match(/(\d+)\s*(MB|KB|GB)/i);
    if (!match) return Infinity;

    const size = parseInt(match[1]);
    const unit = match[2].toUpperCase();

    switch (unit) {
      case "KB":
        return size * 1024;
      case "MB":
        return size * 1024 * 1024;
      case "GB":
        return size * 1024 * 1024 * 1024;
      default:
        return Infinity;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  if (!uploadId) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        id={uploadId}
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {selectedFile ? (
        <div className="flex items-center gap-2 p-2 bg-sidebar border border-gray-700 rounded-lg">
          <File className="h-4 w-4 text-gray-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{selectedFile.name}</p>
            <p className="text-xs text-gray-400">{formatFileSize(selectedFile.size)}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleRemoveFile}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          disabled={disabled}
          className="border-pink-500 text-white hover:bg-pink-500/10 hover:border-pink-400"
        >
          <Upload className="h-4 w-4 mr-2" />
          {label || "رفع ملف"}
        </Button>
      )}

      {maxSize && (
        <p className="text-xs text-gray-400">
          الحجم الأقصى: {maxSize}
        </p>
      )}
    </div>
  );
}

