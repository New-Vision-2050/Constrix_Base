import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { FieldConfig } from "../../types/formTypes";
import { cn } from "@/lib/utils";
import { useFormInstance } from "../../hooks/useFormStore";
import { XCircle, Upload, File as FileIcon, X, FileText, FileType, Image, Archive, Code, FileIcon as FilePdf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { apiClient } from "@/config/axios-config"; // Import apiClient

interface FileFieldProps {
  field: FieldConfig;
  value: File | string | null;
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange: (value: File | string | null) => void;
  onBlur: () => void;
  formId?: string;
}

// Potential Future Enhancements:
// - Direct-to-cloud storage uploads (e.g., S3 presigned URLs) for large files.
// - More robust progress indication, especially for large uploads.
// - Chunked uploading for very large files to improve reliability.
// - Consider using a dedicated upload library for advanced features.

// Helper function to get file icon based on file type
const getFileIcon = (fileType: string | undefined, size: number = 24) => {
  if (!fileType) return <FileIcon size={size} />;

  if (fileType.startsWith('image/')) {
    return <Image size={size} />;
  } else if (fileType === 'application/pdf') {
    return <FilePdf size={size} />;
  } else if (fileType.startsWith('text/')) {
    return <FileText size={size} />;
  } else if (fileType.includes('zip') || fileType.includes('compressed') || fileType.includes('archive')) {
    return <Archive size={size} />;
  } else if (fileType.includes('javascript') || fileType.includes('json') || fileType.includes('html') || fileType.includes('css')) {
    return <Code size={size} />;
  }

  return <FileIcon size={size} />;
};

// Helper function to get file name from URL or File object
const getFileName = (value: File | string | null): string => {
  if (!value) return '';

  if (typeof value === 'string') {
    // Extract filename from URL
    const parts = value.split('/');
    return parts[parts.length - 1];
  } else {
    return value.name;
  }
};

// Helper function to get file size in human-readable format
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to get file type from extension (used for URL strings)
const getFileTypeFromExtension = (fileName: string): string | undefined => {
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    if (!fileExtension) return undefined;
    switch (fileExtension) {
      case 'pdf': return 'application/pdf';
      case 'jpg': case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'gif': return 'image/gif';
      case 'txt': return 'text/plain';
      case 'doc': case 'docx': return 'application/msword';
      case 'xls': case 'xlsx': return 'application/vnd.ms-excel';
      case 'zip': case 'rar': return 'application/zip';
      default: return 'application/octet-stream';
    }
};


const FileField: React.FC<FileFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
  formId = 'default',
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
  const t = useTranslations('FormBuilder.Fields.File');

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

    if (typeof value === 'string') {
      // If value is a URL string, extract file name and use generic icon
      const fileName = getFileName(value);
      const fileType = getFileTypeFromExtension(fileName);
      setFileInfo({
        name: fileName,
        type: fileType,
        icon: getFileIcon(fileType, 40)
      });
    } else if (value instanceof File) {
      // If value is a File object, use its properties
      setFileInfo({
        name: value.name,
        size: formatFileSize(value.size),
        type: value.type,
        icon: getFileIcon(value.type, 40)
      });
    }
  }, [value]);

  // Define uploadFile first
  const uploadFile = useCallback(async (file: File) => {
    if (!field.fileConfig?.uploadUrl) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file); // Use 'file' as the key, adjust if backend expects different

    try {
      const response = await apiClient.post(field.fileConfig.uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Add any specific headers from config, though apiClient might handle auth
          ...(field.fileConfig.uploadHeaders || {}),
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          } else {
            // Handle indeterminate progress if needed
            setUploadProgress(0); // Or some other indicator
          }
        },
      });

      // Assuming the response.data contains the URL or relevant info
      const fileUrl = response.data?.url || response.data?.data?.url || response.data?.fileUrl;

      if (fileUrl && typeof fileUrl === 'string') {
        onChange(fileUrl);
        formInstance.setError(field.name, null); // Clear previous errors on success
      } else {
        console.error("Upload succeeded but no valid URL found in response:", response.data);
        formInstance.setError(field.name, `${t('UploadSuccessful')} but ${t('InvalidResponse')}`);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      // Attempt to get error message from Axios response
      const errorMessage = error.response?.data?.message || error.message || t('UploadFailed');
      formInstance.setError(field.name, errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0); // Reset progress
    }
  }, [field, onChange, formInstance, t]); // End of uploadFile useCallback

  // Handle file selection (now defined after uploadFile)
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type if allowedFileTypes is specified
    if (field.fileConfig?.allowedFileTypes &&
        !field.fileConfig.allowedFileTypes.includes(file.type)) {
      formInstance.setError(field.name, `${t('FileTypeNotAllowed')}: ${field.fileConfig.allowedFileTypes.join(', ')}`);
      return;
    }

    // Validate file size if maxFileSize is specified
    if (field.fileConfig?.maxFileSize && file.size > field.fileConfig.maxFileSize) {
      const maxSizeMB = Math.round(field.fileConfig.maxFileSize / (1024 * 1024) * 10) / 10;
      formInstance.setError(field.name, `${t('FileSizeExceeds')} (${maxSizeMB} MB)`);
      return;
    }

    // Clear previous errors if validation passes
    formInstance.setError(field.name, null);

    // If uploadUrl is provided, upload the file
    if (field.fileConfig?.uploadUrl) {
      uploadFile(file); // Call uploadFile defined above
    } else {
      // Otherwise, just update the value
      onChange(file);
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [field, onChange, formInstance, t, uploadFile]); // Added uploadFile dependency

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
          accept={field.fileConfig?.allowedFileTypes?.join(',') || '*/*'}
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
                <div className="flex-shrink-0 mr-3">
                  {fileInfo.icon}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-medium text-sm truncate">{fileInfo.name}</p>
                  {fileInfo.size && (
                    <p className="text-xs text-muted-foreground">{fileInfo.size}</p>
                  )}
                  {fileInfo.type && (
                    <p className="text-xs text-muted-foreground">{fileInfo.type}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="flex-shrink-0 ml-2 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label={t('RemoveFile')}
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
              minHeight: "120px"
            }}
          >
            <FileIcon className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {isUploading ? `${t('Uploading')} ${uploadProgress}%` : t('ClickToUpload')}
            </p>
            {field.fileConfig?.allowedFileTypes && (
              <p className="text-xs text-muted-foreground mt-1">
                {t('AllowedTypes')}: {field.fileConfig.allowedFileTypes.join(', ')}
              </p>
            )}
            {field.fileConfig?.maxFileSize && (
              <p className="text-xs text-muted-foreground">
                {t('MaxSize')}: {Math.round(field.fileConfig.maxFileSize / (1024 * 1024) * 10) / 10} MB
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
              {t('Uploading')}: {uploadProgress}%
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