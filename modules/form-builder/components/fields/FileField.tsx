import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { FieldConfig } from "../../types/formTypes";
import { cn } from "@/lib/utils";
import { useFormInstance } from "../../hooks/useFormStore";
import {
  XCircle,
  Upload,
  File as FileIcon,
  X,
  FileText,
  FileType,
  Image,
  Archive,
  Code,
  FileIcon as FilePdf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";

// Define the file object type that has mime_type
export interface FileObject {
  name: string;
  size?: number;
  mime_type: string;
}

interface FileFieldProps {
  field: FieldConfig;
  value: File | string | FileObject | null;
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange: (value: File | string | FileObject | null) => void;
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

const FileField: React.FC<FileFieldProps> = ({
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
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size?: string;
    type?: string;
    icon: React.ReactNode;
  } | null>(null);

  // State for upload status
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Get the current locale to determine text direction
  const locale = useLocale();
  const isRtl = locale === "ar";

  // Get translations
  const t = useTranslations("FormBuilder.Fields.File");

  // Get form instance from the store
  const formInstance = useFormInstance(formId);
  const storeErrors = formInstance.errors || {};

  // Check for errors in both the form store and the local state
  const hasStoreError = !!storeErrors[field.name];
  const hasLocalError = !!error && touched;
  const showError = hasLocalError || hasStoreError;

  // Update file info when value changes
  useEffect(() => {
    if (!value) {
      setFileInfo(null);
      return;
    }

    if (typeof value === "string") {
      // If value is a URL string, extract file name and use generic icon
      const fileName = getFileName(value);
      const fileExtension = fileName.split(".").pop()?.toLowerCase();
      let fileType;

      // Try to determine file type from extension
      if (fileExtension) {
        switch (fileExtension) {
          case "pdf":
            fileType = "application/pdf";
            break;
          case "jpg":
          case "jpeg":
            fileType = "image/jpeg";
            break;
          case "png":
            fileType = "image/png";
            break;
          case "gif":
            fileType = "image/gif";
            break;
          case "txt":
            fileType = "text/plain";
            break;
          case "doc":
          case "docx":
            fileType = "application/msword";
            break;
          case "xls":
          case "xlsx":
            fileType = "application/vnd.ms-excel";
            break;
          case "zip":
          case "rar":
            fileType = "application/zip";
            break;
          default:
            fileType = "application/octet-stream";
        }
      }

      setFileInfo({
        name: fileName,
        type: fileType,
        icon: getFileIcon(fileType, 40),
      });
    } else if (value instanceof File) {
      // If value is a File object, use its properties
      setFileInfo({
        name: value.name,
        size: formatFileSize(value.size),
        type: value.type,
        icon: getFileIcon(value.type, 40),
      });
    }
    else if (value && value.mime_type) {
        setFileInfo({
            name: value.name,
            size: formatFileSize(value.size ?? 0),
            type: value.mime_type,
            icon: getFileIcon(value.mime_type, 32),
        });
    }
  }, [value]);

  // Handle file selection
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type if allowedFileTypes is specified
      if (
        field.fileConfig?.allowedFileTypes &&
        !field.fileConfig.allowedFileTypes.includes(file.type)
      ) {
        formInstance.setError(
          field.name,
          `${t("FileTypeNotAllowed")}: ${field.fileConfig.allowedFileTypes.join(
            ", "
          )}`
        );
        return;
      }

      // Validate file size if maxFileSize is specified
      if (
        field.fileConfig?.maxFileSize &&
        file.size > field.fileConfig.maxFileSize
      ) {
        const maxSizeMB =
          Math.round((field.fileConfig.maxFileSize / (1024 * 1024)) * 10) / 10;
        formInstance.setError(
          field.name,
          `${t("FileSizeExceeds")} (${maxSizeMB} MB)`
        );
        return;
      }

      // If uploadUrl is provided, upload the file
      if (field.fileConfig?.uploadUrl) {
        uploadFile(file);
      } else {
        // Otherwise, just update the value
        onChange(file);
      }

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [field, onChange, formInstance, t]
  );

  // Handle file upload
  const uploadFile = useCallback(
    async (file: File) => {
      if (!field.fileConfig?.uploadUrl) return;

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
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
                onChange(fileUrl);
              } else {
                formInstance.setError(
                  field.name,
                  `${t("UploadSuccessful")} ${t("UploadFailed")}`
                );
              }
            } catch (error) {
              formInstance.setError(field.name, t("UploadFailed"));
            }
          } else {
            formInstance.setError(
              field.name,
              `${t("UploadFailed")} (${xhr.status})`
            );
          }
          setIsUploading(false);
        };

        // Handle errors
        xhr.onerror = () => {
          formInstance.setError(field.name, t("UploadFailed"));
          setIsUploading(false);
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
          throw new Error("Upload URL is not defined");
        }

        xhr.send(formData);
      } catch (error) {
        formInstance.setError(field.name, t("UploadFailed"));
        setIsUploading(false);
      }
    },
    [field, onChange, formInstance, t]
  );

  // Handle removing the file
  const handleRemoveFile = useCallback(() => {
    onChange(null);
    formInstance.setError(field.name, null);
  }, [onChange, formInstance, field.name]);

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
        />

        {/* File preview */}
        {fileInfo ? (
          <div className="relative mb-4">
            <div
              className={cn(
                "relative border rounded-md p-4",
                showError ? "border-destructive" : "border-input"
              )}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">{fileInfo.icon}</div>
                <div className="flex-grow min-w-0">
                  <p className="font-medium text-sm truncate">
                    {fileInfo.name}
                  </p>
                  {fileInfo.size && (
                    <p className="text-xs text-muted-foreground">
                      {fileInfo.size}
                    </p>
                  )}
                  {fileInfo.type && (
                    <p className="text-xs text-muted-foreground">
                      {fileInfo.type}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="flex-shrink-0 ml-2 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label={t("RemoveFile")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 mb-4 cursor-pointer hover:bg-muted/50 transition-colors",
              showError ? "border-destructive" : "border-input"
            )}
            onClick={handleUploadClick}
            style={{
              width: "100%",
              minHeight: "120px",
            }}
          >
            <FileIcon className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {isUploading
                ? `${t("Uploading")} ${uploadProgress}%`
                : t("ClickToUpload")}
            </p>
            {field.fileConfig?.allowedFileTypes && (
              <p className="text-xs text-muted-foreground mt-1">
                {t("AllowedTypes")}:{" "}
                {field.fileConfig.allowedFileTypes.join(", ")}
              </p>
            )}
            {field.fileConfig?.maxFileSize && (
              <p className="text-xs text-muted-foreground">
                {t("MaxSize")}:{" "}
                {Math.round(
                  (field.fileConfig.maxFileSize / (1024 * 1024)) * 10
                ) / 10}{" "}
                MB
              </p>
            )}
          </div>
        )}

        {/* Upload progress */}
        {isUploading && (
          <div className="w-full mb-4">
            <div className="w-full bg-muted rounded-full h-2.5 mb-1">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {t("Uploading")}: {uploadProgress}%
            </p>
          </div>
        )}

        {/* Error message */}
        {showError && (
          <div className="text-destructive text-sm mt-1">
            {error || storeErrors[field.name]}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(FileField);
