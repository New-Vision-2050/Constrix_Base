"use client";

import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormLabel from "@/components/shared/FormLabel";
import ConfirmationDialog from "./ConfirmationDialog";
import { useTranslations } from "next-intl";
import { Media } from "@/modules/docs-library/modules/publicDocs/types/Directory";

interface ImageUploadProps {
  label: string;
  maxSize?: string;
  dimensions?: string;
  required?: boolean;
  onChange?: (file: File | null) => void;
  onMultipleChange?: (files: File[]) => void;
  value?: File | string | null;
  initialValue?: string | Media[] | null;
  className?: string;
  minHeight?: string;
  multiple?: boolean;
  accept?: string;
  showDeleteConfirm?: boolean;
  OnDelete?: (input: any) => Promise<void>;
}

export default function ImageUpload({
  label,
  maxSize,
  dimensions = "2160 × 2160",
  required = false,
  onChange,
  onMultipleChange,
  value,
  initialValue,
  className = "",
  minHeight = "200px",
  multiple = false,
  accept = "image/*",
  showDeleteConfirm = false,
  OnDelete,
}: ImageUploadProps) {
  const t = useTranslations(
    "content-management-system.projects.addProjectForm"
  );
  const tCommon = useTranslations("common.imageUpload");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [initialPreviews, setInitialPreviews] = useState<any[]>([]);
  const [uploadId, setUploadId] = useState<string>("");
  
  // Default maxSize with translation if not provided
  const displayMaxSize = maxSize || `3MB - ${tCommon("maxSizeLabel")}`;

  // open delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  // Initialize uploadId only on client side to avoid hydration mismatch
  React.useEffect(() => {
    setUploadId(`upload-${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  // Handle initial value for edit mode
  React.useEffect(() => {
    if (initialValue) {
      if (multiple && Array.isArray(initialValue)) {
        setInitialPreviews(initialValue);
      } else if (!multiple && typeof initialValue === "string") {
        setImagePreview(initialValue);
      }
    }
  }, [initialValue, multiple]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (multiple) {
      const newFiles = Array.from(e.target.files || []);
      // Append new files to existing ones instead of replacing
      const updatedFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(updatedFiles);
      onMultipleChange?.(updatedFiles);
      // Clear initial previews when user starts uploading new files
      if (newFiles.length > 0) {
        setInitialPreviews([]);
      }
      // Reset input to allow selecting the same file again
      e.target.value = "";
    } else {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onChange?.(file);
      }
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setSelectedFiles([]);
    onChange?.(null);
    onMultipleChange?.([]);
    // Reset the input
    if (uploadId) {
      const input = document.getElementById(uploadId) as HTMLInputElement;
      if (input) input.value = "";
    }
  };

  const handleConfirmDelete = async () => {
    await OnDelete?.(itemToDelete);
    
    // Find and remove the specific item from initialPreviews
    if (multiple) {
      const itemIndex = initialPreviews.findIndex(item => {
        if (typeof item === 'string') {
          return item === itemToDelete;
        }
        return item?.id === itemToDelete?.id;
      });
      
      if (itemIndex !== -1) {
        removeInitialImage(itemIndex);
      }
    } else {
      removeImage();
    }
    
    setOpenDeleteDialog(false);
    setItemToDelete(null);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onMultipleChange?.(newFiles);
  };

  const removeInitialImage = (index: number) => {
    const newPreviews = initialPreviews.filter((_, i) => i !== index);
    setInitialPreviews(newPreviews);
    // If all initial images are removed, trigger onChange with empty array
    if (newPreviews.length === 0) {
      onMultipleChange?.([]);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <FormLabel required={required}>{label}</FormLabel>

      {/* Single file mode */}
      {!multiple && (
        <div
          className="relative border-2 border-dashed border-[#3c345a] rounded-lg p-8 flex flex-col items-center justify-center bg-[#1a1a2e]/50 hover:border-primary/50 transition-colors"
          style={{
            background:
              "linear-gradient(135deg, rgba(26, 11, 46, 0.3) 0%, rgba(45, 27, 78, 0.3) 50%, rgba(26, 11, 46, 0.3) 100%)",
            minHeight: minHeight,
          }}
        >
          {imagePreview ? (
            <>
              <img
                src={imagePreview}
                alt={label}
                className="max-h-[150px] object-contain rounded"
              />
              <button
                type="button"
                onClick={() => {
                  if (showDeleteConfirm) {
                    setItemToDelete(imagePreview);
                    setOpenDeleteDialog(true);
                  } else {
                    removeImage();
                  }
                }}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : uploadId ? (
            <>
              <Upload className="w-12 h-12  mb-3" />
              <p className=" text-sm mb-1">{displayMaxSize}</p>
              <p className=" text-xs mb-4">{dimensions}</p>
              <label htmlFor={uploadId}>
                <Button
                  type="button"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={() => document.getElementById(uploadId)?.click()}
                >
                  {tCommon("attach")}
                </Button>
              </label>
              <input
                id={uploadId}
                type="file"
                accept={accept}
                onChange={handleImageChange}
                className="hidden"
              />
            </>
          ) : null}
        </div>
      )}

      {/* Multiple files mode */}
      {multiple && (
        <>
          {/* Display initial images from edit mode */}
          {initialPreviews.length > 0 && selectedFiles.length === 0 && (
            <div className="space-y-3">
              {initialPreviews.map((item, index) => {
                const imageUrl =
                  typeof item === "string" ? item : item?.url || "";
                return (
                  <div
                    key={index}
                    className="relative border-2 border-dashed border-[#3c345a] rounded-lg p-3 hover:border-primary/50 transition-colors flex items-center gap-4"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(26, 11, 46, 0.3) 0%, rgba(45, 27, 78, 0.3) 50%, rgba(26, 11, 46, 0.3) 100%)",
                    }}
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={imageUrl}
                        alt={`Image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300 truncate">
                        {tCommon("existingImage", { index: index + 1 })}
                      </p>
                    </div>
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (showDeleteConfirm) {
                          setItemToDelete(item);
                          setOpenDeleteDialog(true);
                        } else {
                          removeInitialImage(index);
                        }
                      }}
                      className="flex-shrink-0 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Display selected files list */}
          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative border-2 border-dashed border-[#3c345a] rounded-lg p-3 hover:border-primary/50 transition-colors flex items-center gap-4"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(26, 11, 46, 0.3) 0%, rgba(45, 27, 78, 0.3) 50%, rgba(26, 11, 46, 0.3) 100%)",
                  }}
                >
                  {/* Image preview or icon */}
                  <div className="flex-shrink-0">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center rounded bg-[#1a1a2e]">
                        <Upload className="w-6 h-6 " />
                      </div>
                    )}
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="flex-shrink-0 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Add more button */}
              {uploadId && (
                <div
                  className="relative border-2 border-dashed border-[#3c345a] rounded-lg p-4 flex items-center justify-center gap-3 hover:border-primary/50 transition-colors cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(26, 11, 46, 0.3) 0%, rgba(45, 27, 78, 0.3) 50%, rgba(26, 11, 46, 0.3) 100%)",
                  }}
                  onClick={() => document.getElementById(uploadId)?.click()}
                >
                  <Upload className="w-5 h-5 " />
                  <p className=" text-sm">{tCommon("addMoreFiles")}</p>
                  <input
                    id={uploadId}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          )}

          {/* Initial upload area when no files */}
          {selectedFiles.length === 0 && uploadId && (
            <div
              className="relative border-2 border-dashed border-[#3c345a] rounded-lg p-8 flex flex-col items-center justify-center bg-[#1a1a2e]/50 hover:border-primary/50 transition-colors cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, rgba(26, 11, 46, 0.3) 0%, rgba(45, 27, 78, 0.3) 50%, rgba(26, 11, 46, 0.3) 100%)",
                minHeight: minHeight,
              }}
              onClick={() => document.getElementById(uploadId)?.click()}
            >
              <Upload className="w-12 h-12  mb-3" />
              <p className=" text-sm mb-1">{displayMaxSize}</p>
              <p className="text-gray-500 text-xs mb-4">{dimensions}</p>
              <Button
                type="button"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                {tCommon("attach")}
              </Button>
              <input
                id={uploadId}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          )}
        </>
      )}

      {/* delete media confirmation dialog */}
      {showDeleteConfirm && (
        <ConfirmationDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onConfirm={handleConfirmDelete}
          description={t("deleteConfirmMessage") ?? ""}
          showDatePicker={false}
        />
      )}
    </div>
  );
}
