import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { FieldConfig } from "../../types/formTypes";
import { cn } from "@/lib/utils";
import { useFormInstance } from "../../hooks/useFormStore";
import { XCircle, Upload, File as FileIcon, X, FileText, FileType, Image, Archive, Code, Plus, FileIcon as FilePdf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { apiClient } from "@/config/axios-config"; // Import apiClient

interface MultiFileFieldProps {
  field: FieldConfig;
  value: Array<File | string> | null;
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange: (value: Array<File | string> | null) => void;
  onBlur: () => void;
  formId?: string;
}

// Potential Future Enhancements:
// - Direct-to-cloud storage uploads (e.g., S3 presigned URLs) for large files, potentially uploading in parallel.
// - More robust progress indication for individual files and overall batch progress.
// - Chunked uploading for very large files.
// - Consider using a dedicated upload library (e.g., Uppy) for advanced features like resumable uploads, drag-and-drop improvements, etc.

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

// Helper function to get file type from extension
const getFileTypeFromExtension = (fileName: string): string | undefined => {
  const fileExtension = fileName.split('.').pop()?.toLowerCase();

  if (!fileExtension) return undefined;

  switch (fileExtension) {
    case 'pdf':
      return 'application/pdf';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'txt':
      return 'text/plain';
    case 'doc':
    case 'docx':
      return 'application/msword';
    case 'xls':
    case 'xlsx':
      return 'application/vnd.ms-excel';
    case 'zip':
    case 'rar':
      return 'application/zip';
    default:
      return 'application/octet-stream';
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
  formId = 'default',
}) => {
  // Reference to the file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for file info
  const [filesInfo, setFilesInfo] = useState<FileInfo[]>([]);
  const [overallUploadProgress, setOverallUploadProgress] = useState<number | null>(null); // State for overall progress

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

  // Normalize value to array
  const normalizedValue = Array.isArray(value) ? value : (value ? [value] : []);

  // Update files info when value changes
  useEffect(() => {
    if (!normalizedValue || normalizedValue.length === 0) {
      setFilesInfo([]);
      return;
    }

    const newFilesInfo: FileInfo[] = normalizedValue.map((item, index) => {
      // Check if this item already exists in filesInfo (to preserve upload state)
      const existingInfo = filesInfo.find(info => {
        if (typeof item === 'string' && typeof info.file === 'string') {
          return item === info.file;
        } else if (item instanceof File && info.file instanceof File) {
          // Basic check, might need refinement if File instances change
          return item.name === info.file.name && item.size === info.file.size;
        }
        return false;
      });

      if (existingInfo) {
        return existingInfo; // Keep existing info with upload state
      }

      // Create new info if not found
      if (typeof item === 'string') {
        const fileName = getFileName(item);
        const fileType = getFileTypeFromExtension(fileName);
        return {
          id: `file-${Date.now()}-${index}`, // Use timestamp for better uniqueness
          name: fileName,
          type: fileType,
          icon: getFileIcon(fileType, 32),
          file: item
        };
      } else if (item instanceof File) {
        return {
          id: `file-${Date.now()}-${index}`,
          name: item.name,
          size: formatFileSize(item.size),
          type: item.type,
          icon: getFileIcon(item.type, 32),
          file: item
        };
      }

      // Fallback for unknown types (should ideally not happen)
      return {
        id: `file-${Date.now()}-${index}`,
        name: 'Unknown file',
        icon: getFileIcon(undefined, 32),
        file: item as any // Cast as any to satisfy type, handle appropriately if needed
      };
    });

    setFilesInfo(newFilesInfo);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedValue]); // Dependency only on normalizedValue to avoid loops with filesInfo

  // Define uploadFiles first
  const uploadFiles = useCallback(async (files: File[]) => {
    if (!field.fileConfig?.uploadUrl) return;

    setOverallUploadProgress(0); // Initialize overall progress

    // Create temporary file info objects for the uploading files
    const uploadingFilesInfo: FileInfo[] = files.map((file, index) => ({
      id: `uploading-${Date.now()}-${index}`,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      icon: getFileIcon(file.type, 32),
      file: file,
      isUploading: true,
      uploadProgress: 0
    }));

    // Add the uploading files to the state
    setFilesInfo(prev => [...prev, ...uploadingFilesInfo]);

    // Upload each file and track overall progress
    const individualProgress: { [key: string]: number } = {};
    uploadingFilesInfo.forEach(f => individualProgress[f.id] = 0);

    const uploadPromises = files.map((file, fileIndex) => {
      return new Promise<string>(async (resolve, reject) => { // Make inner function async
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await apiClient.post(field.fileConfig!.uploadUrl!, formData, { // Added non-null assertions as check happens earlier
            headers: {
              'Content-Type': 'multipart/form-data',
              ...(field.fileConfig!.uploadHeaders || {}),
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                // Update individual and overall progress
                individualProgress[uploadingFilesInfo[fileIndex].id] = progress;
                const totalProgressSum = Object.values(individualProgress).reduce((sum, p) => sum + p, 0);
                const calculatedOverallProgress = Math.round(totalProgressSum / files.length);
                setOverallUploadProgress(calculatedOverallProgress);
                // Update UI state for the specific file
                setFilesInfo(prev => prev.map(fileInfo =>
                  fileInfo.id === uploadingFilesInfo[fileIndex].id
                    ? { ...fileInfo, uploadProgress: progress }
                    : fileInfo
                ));
              }
            },
          });

          // Process successful response
          const fileUrl = response.data?.url || response.data?.data?.url || response.data?.fileUrl;
          if (fileUrl && typeof fileUrl === 'string') {
            resolve(fileUrl);
          } else {
            console.error("Upload succeeded but no valid URL found in response:", response.data);
            reject(new Error(`${t('UploadSuccessful')} but ${t('InvalidResponse')}`));
          }
        } catch (error: any) {
          console.error(`Upload error for ${file.name}:`, error);
          const errorMessage = error.response?.data?.message || error.message || t('UploadFailed');
          reject(new Error(errorMessage)); // Reject promise with error message
        }
      });
    });

    // Wait for all uploads to complete
    try {
      const results = await Promise.allSettled(uploadPromises);

      // Process results
      const uploadedUrls: string[] = [];
      const failedUploads: string[] = [];

      results.forEach((result, index) => {
        // const fileId = uploadingFilesInfo[index].id; // Not needed directly here
        if (result.status === 'fulfilled') {
          uploadedUrls.push(result.value);
        } else {
          console.error(`Upload failed for ${files[index].name}:`, result.reason);
          failedUploads.push(files[index].name);
          // Optionally update the specific fileInfo state to show an error indicator
          setFilesInfo(prev => prev.map(f =>
            f.id === uploadingFilesInfo[index].id
              ? { ...f, isUploading: false, uploadProgress: undefined /*, error: 'Failed' */ }
              : f
          ));
        }
      });

      // Update file info state after all uploads are settled (remove progress)
      setFilesInfo(prev => {
        const finalFilesInfo = prev.map(f => {
          const uploadingInfoIndex = uploadingFilesInfo.findIndex(uf => uf.id === f.id);
          if (uploadingInfoIndex !== -1) {
            // This file was part of the upload batch
            const result = results[uploadingInfoIndex];
            if (result.status === 'fulfilled') {
              // Successfully uploaded: update file to URL, clear upload state
              return { ...f, file: result.value, isUploading: false, uploadProgress: undefined };
            } else {
              // Failed upload: clear upload state but keep the original File object
              return { ...f, isUploading: false, uploadProgress: undefined /*, error: 'Upload Failed' */ };
            }
          }
          return f; // Keep files not part of this batch
        });

        // Optionally filter out files that failed to upload completely
        // return finalFilesInfo.filter(f => !(f.error === 'Upload Failed'));
        return finalFilesInfo;
      });

      // If at least one file was uploaded successfully
      if (uploadedUrls.length > 0) {
        // Combine existing URLs/Files with new URLs
        const existingValues = normalizedValue.filter(item => typeof item === 'string' || !(item instanceof File)); // Keep existing URLs/non-files
        onChange([...existingValues, ...uploadedUrls]);
      }

      // If some uploads failed
      if (failedUploads.length > 0) {
        formInstance.setError(field.name, `${t('UploadsFailed')}: ${failedUploads.join(', ')}`);
      }
    } catch (error) {
      // Catch any unexpected errors during Promise.allSettled or processing
      console.error('Upload processing error:', error);
      formInstance.setError(field.name, t('UploadFailed'));
      // Ensure uploading state is cleared even if processing fails
      setFilesInfo(prev => prev.map(f => uploadingFilesInfo.some(uf => uf.id === f.id) ? { ...f, isUploading: false, uploadProgress: undefined } : f));
    } finally {
      setOverallUploadProgress(null); // Reset overall progress regardless of success/failure
    }
  }, [field, onChange, formInstance, value, t, normalizedValue]); // End of uploadFiles useCallback

  // Handle file selection (now defined after uploadFiles)
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate each file
    const validFiles: File[] = [];
    const invalidFiles: { file: File, reason: string }[] = [];

    files.forEach(file => {
      // Validate file type if allowedFileTypes is specified
      if (field.fileConfig?.allowedFileTypes &&
          !field.fileConfig.allowedFileTypes.includes(file.type)) {
        invalidFiles.push({
          file,
          reason: `${t('FileTypeNotAllowed')}: ${field.fileConfig.allowedFileTypes.join(', ')}`
        });
        return;
      }

      // Validate file size if maxFileSize is specified
      if (field.fileConfig?.maxFileSize && file.size > field.fileConfig.maxFileSize) {
        const maxSizeMB = Math.round(field.fileConfig.maxFileSize / (1024 * 1024) * 10) / 10;
        invalidFiles.push({
          file,
          reason: `${t('FileSizeExceeds')} (${maxSizeMB} MB)`
        });
        return;
      }

      validFiles.push(file);
    });

    // If there are invalid files, show errors
    if (invalidFiles.length > 0) {
      const errorMessages = invalidFiles.map(item =>
        `${item.file.name}: ${item.reason}`
      );
      formInstance.setError(field.name, errorMessages.join('\n'));

      // If all files are invalid, return
      if (validFiles.length === 0) return;
    } else {
       // Clear previous errors if all selected files are valid
       formInstance.setError(field.name, null);
    }

    // If uploadUrl is provided, upload the files
    if (field.fileConfig?.uploadUrl) {
      uploadFiles(validFiles); // Call uploadFiles defined above
    } else {
      // Otherwise, just update the value
      // Combine existing files (if any) with new files
      const existingFiles = Array.isArray(value) ? value : (value ? [value] : []);
      onChange([...existingFiles, ...validFiles]);
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [field, onChange, formInstance, value, t, uploadFiles]); // Added uploadFiles dependency

  // Handle removing a file
  const handleRemoveFile = useCallback((index: number) => {
    // Use the current filesInfo state to find the item by index
    const fileInfoToRemove = filesInfo[index];
    if (!fileInfoToRemove) return;

    // Filter the main value array (containing Files and URLs)
    const newValue = normalizedValue.filter((item, i) => {
      // Rely on index matching between filesInfo and normalizedValue
      // This assumes the order is preserved, which should be the case here.
      return i !== index;
    });

    // If the array is now empty, set to null or empty array based on your preference
    onChange(newValue.length === 0 ? [] : newValue);

    // Clear any errors related to the main field name
    formInstance.setError(field.name, null);
  }, [onChange, formInstance, field.name, normalizedValue, filesInfo]); // End of handleRemoveFile useCallback

  // Handle clicking the upload button
  const handleUploadClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []); // End of handleUploadClick useCallback

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
          multiple={true} // Always allow multiple files
        />

        {/* Files list */}
        {filesInfo.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filesInfo.map((fileInfo, index) => (
                <div
                  key={fileInfo.id}
                  className={cn(
                    "relative border rounded-md p-3",
                    showError ? "border-destructive" : "border-input",
                    fileInfo.isUploading ? "bg-muted/20" : ""
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
                      {fileInfo.isUploading && fileInfo.uploadProgress !== undefined && (
                        <div className="w-full mt-1">
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${fileInfo.uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {fileInfo.uploadProgress}%
                          </p>
                        </div>
                      )}
                    </div>
                    {!fileInfo.isUploading && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="flex-shrink-0 ml-2 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label={t('RemoveFile')}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overall Upload progress */}
        {overallUploadProgress !== null && overallUploadProgress >= 0 && (
          <div className="w-full mb-4 px-1">
            <p className="text-xs text-muted-foreground text-center mb-1">
              {t('OverallProgress')}: {overallUploadProgress}%
            </p>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-150"
                style={{ width: `${overallUploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Upload area */}
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
          {filesInfo.length > 0 ? (
            <>
              <Plus className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {t('AddMoreFiles')}
              </p>
            </>
          ) : (
            <>
              <FileIcon className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {t('ClickToUploadMultiple')}
              </p>
            </>
          )}

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