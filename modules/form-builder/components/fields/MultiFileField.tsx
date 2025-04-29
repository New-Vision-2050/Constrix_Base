"use client";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { FieldConfig } from "../../types/formTypes";
import { cn } from "@/lib/utils";
import { useFormInstance } from "../../hooks/useFormStore";
import {
  File as FileIcon,
  FileText,
  Image,
  Archive,
  Code,
  Plus,
  FileIcon as FilePdf,
  UploadCloud,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface MultiFileFieldProps {
  field: FieldConfig;
  value: Array<File | string> | null;
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange: (value: Array<File | string> | null) => void;
  onBlur: () => void;
  formId?: string;
}

// Helper function to get file icon based on file type
const getFileIcon = (fileType: string | undefined, size: number = 24) => {
  if (!fileType) return <FileIcon size={size} />;

  if (fileType.startsWith("image/")) {
    return <Image size={size} />;
  } else if (fileType === "application/pdf") {
    return <FilePdf size={size} />;
  } else if (fileType.startsWith("text/")) {
    return <FileText size={size} />;
  } else if (
    fileType.includes("zip") ||
    fileType.includes("compressed") ||
    fileType.includes("archive")
  ) {
    return <Archive size={size} />;
  } else if (
    fileType.includes("javascript") ||
    fileType.includes("json") ||
    fileType.includes("html") ||
    fileType.includes("css")
  ) {
    return <Code size={size} />;
  }

  return <FileIcon size={size} />;
};

// Helper function to get file name from URL or File object
const getFileName = (value: File | string | null): string => {
  if (!value) return "";

  if (typeof value === "string") {
    // Extract filename from URL
    const parts = value.split("/");
    return parts[parts.length - 1];
  } else {
    return value.name;
  }
};

// Helper function to get file size in human-readable format
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Helper function to get file type from extension
const getFileTypeFromExtension = (fileName: string): string | undefined => {
  const fileExtension = fileName.split(".").pop()?.toLowerCase();

  if (!fileExtension) return undefined;

  switch (fileExtension) {
    case "pdf":
      return "application/pdf";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "txt":
      return "text/plain";
    case "doc":
    case "docx":
      return "application/msword";
    case "xls":
    case "xlsx":
      return "application/vnd.ms-excel";
    case "zip":
    case "rar":
      return "application/zip";
    default:
      return "application/octet-stream";
  }
};

interface FileInfo {
  id: string;
  name: string;
  size?: string;
  type?: string;
  icon: React.ReactNode;
  file: File | string;
  isUploading?: boolean;
  uploadProgress?: number;
}

const MultiFileField: React.FC<MultiFileFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
  formId = "default",
}) => {
  // Reference to the file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for file info
  const [filesInfo, setFilesInfo] = useState<FileInfo[]>([]);

  // Get the current locale to determine text direction

  // Get translations
  const t = useTranslations("FormBuilder.Fields.File");

  // Get form instance from the store
  const formInstance = useFormInstance(formId);
  const storeErrors = formInstance.errors || {};

  // Check for errors in both the form store and the local state
  const hasStoreError = !!storeErrors[field.name];
  const hasLocalError = !!error && touched;
  const showError = hasLocalError || hasStoreError;

  // Normalize value to array
  const normalizedValue = Array.isArray(value) ? value : value ? [value] : [];

  // Update files info when value changes
  useEffect(() => {
    if (!normalizedValue || normalizedValue.length === 0) {
      setFilesInfo([]);
      return;
    }

    const newFilesInfo: FileInfo[] = normalizedValue.map((item, index) => {
      if (typeof item === "string") {
        // If item is a URL string, extract file name and use generic icon
        const fileName = getFileName(item);
        const fileType = getFileTypeFromExtension(fileName);

        return {
          id: `file-${index}`,
          name: fileName,
          type: fileType,
          icon: getFileIcon(fileType, 32),
          file: item,
        };
      } else if (item instanceof File) {
        // If item is a File object, use its properties
        return {
          id: `file-${index}`,
          name: item.name,
          size: formatFileSize(item.size),
          type: item.type,
          icon: getFileIcon(item.type, 32),
          file: item,
        };
      }

      // This should never happen, but TypeScript requires a return
      return {
        id: `file-${index}`,
        name: "Unknown file",
        icon: getFileIcon(undefined, 32),
        file: item,
      };
    });

    setFilesInfo(newFilesInfo);
  }, [normalizedValue]);

  // Handle file selection
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      // Validate each file
      const validFiles: File[] = [];
      const invalidFiles: { file: File; reason: string }[] = [];

      files.forEach((file) => {
        // Validate file type if allowedFileTypes is specified
        if (
          field.fileConfig?.allowedFileTypes &&
          !field.fileConfig.allowedFileTypes.includes(file.type)
        ) {
          invalidFiles.push({
            file,
            reason: `${t(
              "FileTypeNotAllowed"
            )}: ${field.fileConfig.allowedFileTypes.join(", ")}`,
          });
          return;
        }

        // Validate file size if maxFileSize is specified
        if (
          field.fileConfig?.maxFileSize &&
          file.size > field.fileConfig.maxFileSize
        ) {
          const maxSizeMB =
            Math.round((field.fileConfig.maxFileSize / (1024 * 1024)) * 10) /
            10;
          invalidFiles.push({
            file,
            reason: `${t("FileSizeExceeds")} (${maxSizeMB} MB)`,
          });
          return;
        }

        validFiles.push(file);
      });

      // If there are invalid files, show errors
      if (invalidFiles.length > 0) {
        const errorMessages = invalidFiles.map(
          (item) => `${item.file.name}: ${item.reason}`
        );
        formInstance.setError(field.name, errorMessages.join("\n"));

        // If all files are invalid, return
        if (validFiles.length === 0) return;
      }

      // If uploadUrl is provided, upload the files
      if (field.fileConfig?.uploadUrl) {
        uploadFiles(validFiles);
      } else {
        // Otherwise, just update the value
        // Combine existing files (if any) with new files
        const existingFiles = Array.isArray(value)
          ? value
          : value
          ? [value]
          : [];
        onChange([...existingFiles, ...validFiles]);
      }

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [field, onChange, formInstance, value, t]
  );

  // Handle multiple file uploads
  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (!field.fileConfig?.uploadUrl) return;

      // Create temporary file info objects for the uploading files
      const uploadingFilesInfo: FileInfo[] = files.map((file, index) => ({
        id: `uploading-${Date.now()}-${index}`,
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
        icon: getFileIcon(file.type, 32),
        file: file,
        isUploading: true,
        uploadProgress: 0,
      }));

      // Add the uploading files to the state
      setFilesInfo((prev) => [...prev, ...uploadingFilesInfo]);

      // Upload each file
      const uploadPromises = files.map((file, fileIndex) => {
        return new Promise<string>((resolve, reject) => {
          const formData = new FormData();
          formData.append("file", file);

          const xhr = new XMLHttpRequest();

          // Track upload progress
          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);

              // Update progress for this specific file
              setFilesInfo((prev) =>
                prev.map((fileInfo) => {
                  if (fileInfo.id === uploadingFilesInfo[fileIndex].id) {
                    return {
                      ...fileInfo,
                      uploadProgress: progress,
                    };
                  }
                  return fileInfo;
                })
              );
            }
          });

          // Handle response
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                // Assuming the response contains a URL to the uploaded file
                const fileUrl =
                  response.url || response.data?.url || response.fileUrl;

                if (fileUrl) {
                  resolve(fileUrl);
                } else {
                  reject(
                    new Error(`${t("UploadSuccessful")} ${t("UploadFailed")}`)
                  );
                }
              } catch (error) {
                console.log(error);
                reject(new Error(t("UploadFailed")));
              }
            } else {
              reject(new Error(`${t("UploadFailed")} (${xhr.status})`));
            }
          };

          // Handle errors
          xhr.onerror = () => {
            reject(new Error(t("UploadFailed")));
          };

          // Open and send the request
          if (field.fileConfig?.uploadUrl) {
            xhr.open("POST", field.fileConfig.uploadUrl);

            // Add custom headers if provided
            if (field.fileConfig.uploadHeaders) {
              Object.entries(field.fileConfig.uploadHeaders).forEach(
                ([key, value]) => {
                  xhr.setRequestHeader(key, value);
                }
              );
            }
          } else {
            reject(new Error("Upload URL is not defined"));
            return;
          }

          xhr.send(formData);
        });
      });

      // Wait for all uploads to complete
      try {
        const results = await Promise.allSettled(uploadPromises);

        // Process results
        const uploadedUrls: string[] = [];
        const failedUploads: string[] = [];

        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            uploadedUrls.push(result.value);
          } else {
            console.error("Upload failed:", result.reason);
            failedUploads.push(files[index].name);
          }
        });

        // Remove the temporary uploading files
        setFilesInfo((prev) =>
          prev.filter(
            (fileInfo) =>
              !uploadingFilesInfo.some((uf) => uf.id === fileInfo.id)
          )
        );

        // If at least one file was uploaded successfully
        if (uploadedUrls.length > 0) {
          // Combine existing URLs (if any) with new URLs
          const existingUrls = Array.isArray(value)
            ? value
            : value
            ? [value]
            : [];
          onChange([...existingUrls, ...uploadedUrls]);
        }

        // If some uploads failed
        if (failedUploads.length > 0) {
          formInstance.setError(
            field.name,
            `${t("UploadsFailed")}: ${failedUploads.join(", ")}`
          );
        }
      } catch (error) {
        console.error("Upload error:", error);
        formInstance.setError(field.name, t("UploadFailed"));

        // Remove the temporary uploading files
        setFilesInfo((prev) =>
          prev.filter(
            (fileInfo) =>
              !uploadingFilesInfo.some((uf) => uf.id === fileInfo.id)
          )
        );
      }
    },
    [field, onChange, formInstance, value, t]
  );

  // Handle removing a file
  const handleRemoveFile = useCallback(
    (index: number) => {
      if (!Array.isArray(value)) return;

      const newValue = [...value];
      newValue.splice(index, 1);

      // If the array is now empty, set to null or empty array based on your preference
      onChange(newValue.length === 0 ? [] : newValue);

      // Clear any errors
      formInstance.setError(field.name, null);
    },
    [onChange, formInstance, field.name, value]
  );

  // Handle clicking the upload button
  const handleUploadClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  return (
    <div className="relative">
      <div
        className={cn(
          "flex flex-col",
          field.width ? field.width : "w-full",
          field.containerClassName
        )}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={field.fileConfig?.allowedFileTypes?.join(",") || "*/*"}
          className="hidden"
          onChange={handleFileChange}
          onBlur={onBlur}
          multiple={true} // Always allow multiple files
        />

        {/* Files list */}
        {filesInfo.length > 0 && (
          <div className="mb-4  rounded-lg p-4">
            <h3 className=" text-sm mb-4">المستندات المرفقة</h3>
            <div className="flex flex-col gap-4">
              {filesInfo.map((fileInfo, index) => (
                <div
                  key={fileInfo.id}
                  className="flex items-center justify-between p-4 rounded-lg "
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full">
                      {fileInfo.icon}
                    </div>
                    <div>
                      <p className=" font-medium">{fileInfo.name}</p>
                      <p className=" text-sm">11:31 21-05-2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-[#D32F2F]  transition-colors"
                      aria-label="Delete File"
                    >
                      <Trash2Icon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Upload area */}
        <div
          className={cn(
            "flex flex-col items-center justify-center bg-sidebar rounded-md p-4 mb-4 cursor-pointer ",
            showError ? "border-destructive" : "border-input"
          )}
          onClick={handleUploadClick}
          style={{
            width: "100%",
            minHeight: "120px",
          }}
        >
          {filesInfo.length > 0 ? (
            <>
              <Plus className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {t("AddMoreFiles")}
              </p>
            </>
          ) : (
            <>
              <UploadCloud className="h-16 w-16 text-primary mb-2" />
              <p className="text-lg text-foreground mb-2">{t("AttachFile")}</p>
            </>
          )}
          {field.fileConfig?.allowedFileTypes && (
            <p className="text-xs text-muted-foreground mt-1">
              {t("AllowedTypes")}:{" "}
              {field.fileConfig.allowedFileTypes.join(", ")}
            </p>
          )}
          {field.fileConfig?.maxFileSize && (
            <p className="text-xs text-muted-foreground">
              {t("MaxSize")}:{" "}
              {Math.round((field.fileConfig.maxFileSize / (1024 * 1024)) * 10) /
                10}{" "}
              MB
            </p>
          )}
          <Button className="mt-4">{t("Upload")}</Button>
        </div>

        {/* Error message */}
        {showError && (
          <div className="text-destructive text-sm mt-1 whitespace-pre-line">
            {error || storeErrors[field.name]}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(MultiFileField);
