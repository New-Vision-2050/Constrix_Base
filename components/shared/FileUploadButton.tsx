"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, File as FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
        // Note: This won't work for actual file operations, just for display
        // For now, we'll skip handling string URLs as files
      }
    }
  }, [initialValue, selectedFile]);

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

  const truncateFileName = (
    fileName: string,
    maxLength: number = 10
  ): string => {
    if (fileName.length <= maxLength) {
      return fileName;
    }

    // Get file extension
    const lastDotIndex = fileName.lastIndexOf(".");
    if (lastDotIndex === -1) {
      // No extension, just truncate
      return fileName.slice(0, maxLength - 3) + "...";
    }

    const nameWithoutExt = fileName.slice(0, lastDotIndex);
    const extension = fileName.slice(lastDotIndex);
    const extensionLength = extension.length;

    // Calculate how much space we have for the name part
    const availableLength = maxLength - extensionLength - 3; // 3 for "..."

    if (nameWithoutExt.length <= availableLength) {
      return fileName;
    }

    // Truncate name part and add ellipsis
    return nameWithoutExt.slice(0, availableLength) + "..." + extension;
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
        <div className="flex items-center gap-2 p-2 bg-sidebar border border-sidebar-border rounded-lg">
          <FileIcon className="h-4 w-4 text-sidebar-foreground/60 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p
                    className="text-sm text-sidebar-foreground truncate cursor-default"
                    title={selectedFile.name}
                  >
                    {truncateFileName(selectedFile.name)}
                  </p>
                </TooltipTrigger>
                {selectedFile.name.length > 30 && (
                  <TooltipContent>
                    <p className="max-w-xs break-words">{selectedFile.name}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            <p className="text-xs text-sidebar-foreground/60">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleRemoveFile}
            disabled={disabled}
            className="flex-shrink-0 border-sidebar-border hover:bg-sidebar-accent hover:border-sidebar-accent-foreground"
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
          className="text-sidebar-foreground border-primary border-2 hover:bg-primary/10 hover:border-primary hover:text-primary transition-colors"
        >
          <Upload className="h-4 w-4 mr-2" />
          {label || "رفع ملف"}
        </Button>
      )}

      {maxSize && (
        <p className="text-xs text-sidebar-foreground/60">
          الحجم الأقصى: {maxSize}
        </p>
      )}
    </div>
  );
}
