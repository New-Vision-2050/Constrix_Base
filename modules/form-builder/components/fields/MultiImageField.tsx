import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { FieldConfig } from "../../types/formTypes";
import { cn } from "@/lib/utils";
import { useFormInstance } from "../../hooks/useFormStore";
import { XCircle, Upload, Image as ImageIcon, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";

// Define a type for objects with a url property
interface FileWithUrl {
  url: string;
  [key: string]: any;
}

interface MultiImageFieldProps {
  field: FieldConfig;
  value: Array<File | string | FileWithUrl> | null;
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange: (value: Array<File | string | FileWithUrl> | null) => void;
  onBlur: () => void;
  formId?: string;
}

const MultiImageField: React.FC<MultiImageFieldProps> = ({
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

  // State for image previews
  const [previews, setPreviews] = useState<string[]>([]);

  // State for upload status
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Get the current locale to determine text direction
  const locale = useLocale();
  const isRtl = locale === "ar";

  // Get translations
  const t = useTranslations('FormBuilder.Fields.Image');

  // Get form instance from the store
  const formInstance = useFormInstance(formId);
  const storeErrors = formInstance.errors || {};

  // Check for errors in both the form store and the local state
  const hasStoreError = !!storeErrors[field.name];
  const hasLocalError = !!error && touched;
  const showError = hasLocalError || hasStoreError;

  // Normalize value to array
  const normalizedValue = Array.isArray(value) ? value : (value ? [value] : []);

  // Generate previews when value changes
  useEffect(() => {
    if (!normalizedValue || normalizedValue.length === 0) {
      setPreviews([]);
      return;
    }

    // Create an array to store the preview URLs
    const newPreviews: string[] = [];

    // Create object URLs for File objects
    const objectUrls: string[] = [];

    normalizedValue.forEach((item) => {
      if (typeof item === 'string') {
        // If item is a URL string, use it directly as preview
        newPreviews.push(item);
      }
      else if(item.hasOwnProperty('url')){
              newPreviews.push((item as FileWithUrl).url);
      }

      else if (item instanceof File) {
        // If item is a File object, create a preview URL
        const objectUrl = URL.createObjectURL(item);
        newPreviews.push(objectUrl);
        objectUrls.push(objectUrl);
      }
    });

    setPreviews(newPreviews);

    // Clean up the URLs when component unmounts or value changes
    return () => {
      objectUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [normalizedValue]);

  // Handle file selection
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate each file
    const validFiles: File[] = [];
    const invalidFiles: { file: File, reason: string }[] = [];

    files.forEach(file => {
      // Validate file type if allowedFileTypes is specified
      if (field.imageConfig?.allowedFileTypes &&
          !field.imageConfig.allowedFileTypes.includes(file.type)) {
        invalidFiles.push({
          file,
          reason: `${t('FileTypeNotAllowed')}: ${field.imageConfig.allowedFileTypes.join(', ')}`
        });
        return;
      }

      // Validate file size if maxFileSize is specified
      if (field.imageConfig?.maxFileSize && file.size > field.imageConfig.maxFileSize) {
        const maxSizeMB = Math.round(field.imageConfig.maxFileSize / (1024 * 1024) * 10) / 10;
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
    }

    // If uploadUrl is provided, upload the files
    if (field.imageConfig?.uploadUrl) {
      uploadFiles(validFiles);
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
  }, [field, onChange, formInstance, value]);

  // Handle multiple image uploads
  const uploadFiles = useCallback(async (files: File[]) => {
    if (!field.imageConfig?.uploadUrl) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create an array to store uploaded URLs
      const uploadedUrls: string[] = [];
      let completedUploads = 0;

      // Process each file
      const uploadPromises = files.map(file => {
        return new Promise<string>((resolve, reject) => {
          const formData = new FormData();
          formData.append('file', file);

          const xhr = new XMLHttpRequest();

          // Track upload progress
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              // Calculate overall progress based on this file's progress
              const fileProgress = Math.round((event.loaded / event.total) * 100);
              const overallProgress = Math.round(
                ((completedUploads * 100) + fileProgress) / files.length
              );
              setUploadProgress(overallProgress);
            }
          });

          // Handle response
          xhr.onload = () => {
            completedUploads++;

            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                // Assuming the response contains a URL to the uploaded image
                const imageUrl = response.url || response.data?.url || response.imageUrl;
                if (imageUrl) {
                  resolve(imageUrl);
                } else {
                  reject(new Error(`${t('UploadSuccessful')} ${t('UploadFailed')}`));
                }
              } catch (error) {
                reject(new Error(t('UploadFailed')));
              }
            } else {
              reject(new Error(`${t('UploadFailed')} (${xhr.status})`));
            }
          };

          // Handle errors
          xhr.onerror = () => {
            completedUploads++;
            reject(new Error(t('UploadFailed')));
          };

          // Open and send the request
          if (field.imageConfig?.uploadUrl) {
            xhr.open('POST', field.imageConfig.uploadUrl);

            // Add custom headers if provided
            if (field.imageConfig.uploadHeaders) {
              Object.entries(field.imageConfig.uploadHeaders).forEach(([key, value]) => {
                xhr.setRequestHeader(key, value);
              });
            }
          } else {
            reject(new Error('Upload URL is not defined'));
            return;
          }

          xhr.send(formData);
        });
      });

      // Wait for all uploads to complete
      const results = await Promise.allSettled(uploadPromises);

      // Process results
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          uploadedUrls.push(result.value);
        } else {
          console.error('Upload failed:', result.reason);
          formInstance.setError(field.name, result.reason.message);
        }
      });

      // If at least one file was uploaded successfully
      if (uploadedUrls.length > 0) {
        // Combine existing URLs (if any) with new URLs
        const existingUrls = Array.isArray(value) ? value : (value ? [value] : []);
        onChange([...existingUrls, ...uploadedUrls]);
      }

      // If some uploads failed
      if (uploadedUrls.length < files.length) {
        formInstance.setError(field.name, `${files.length - uploadedUrls.length} ${t('UploadsFailed')}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      formInstance.setError(field.name, t('UploadFailed'));
    } finally {
      setIsUploading(false);
    }
  }, [field, onChange, formInstance, value]);

  // Handle removing an image
  const handleRemoveImage = useCallback((index: number) => {
    if (!Array.isArray(value)) return;

    const newValue = [...value];
    newValue.splice(index, 1);

    // If the array is now empty, set to null or empty array based on your preference
    onChange(newValue.length === 0 ? [] : newValue);

    // Clear any errors
    formInstance.setError(field.name, null);
  }, [onChange, formInstance, field.name, value]);

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
          accept={field.imageConfig?.allowedFileTypes?.join(',') || 'image/*'}
          className="hidden"
          onChange={handleFileChange}
          onBlur={onBlur}
          multiple={true} // Always allow multiple files
        />

        {/* Image previews */}
        {previews.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative">
                <div
                  className={cn(
                    "relative border rounded-md overflow-hidden w-full",
                    showError ? "border-destructive" : "border-input"
                  )}
                  style={{
                    aspectRatio: field.imageConfig?.aspectRatio || 1,
                    maxWidth: "100%"
                  }}
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-colors"
                    aria-label={t('RemoveImage')}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

          </div>
        ) : null}

        {/* Upload area */}
        <div
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 mb-4 cursor-pointer hover:bg-muted/50 transition-colors",
            showError ? "border-destructive" : "border-input"
          )}
          onClick={handleUploadClick}
          style={{
            width: "100%",
            minHeight: "150px",
            aspectRatio: field.imageConfig?.aspectRatio || 16/9
          }}
        >
          {previews.length > 0 ? (
            <>
              <Plus className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {t('AddMoreImages')}
              </p>
            </>
          ) : (
            <>
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {isUploading ? `${t('Uploading')} ${uploadProgress}%` : t('ClickToUploadMultiple')}
              </p>
            </>
          )}

          {field.imageConfig?.allowedFileTypes && (
            <p className="text-xs text-muted-foreground mt-1">
              {t('AllowedTypes')}: {field.imageConfig.allowedFileTypes.map(type => type.replace('image/', '')).join(', ')}
            </p>
          )}
          {field.imageConfig?.maxFileSize && (
            <p className="text-xs text-muted-foreground">
              {t('MaxSize')}: {Math.round(field.imageConfig.maxFileSize / (1024 * 1024) * 10) / 10} MB
            </p>
          )}
        </div>

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
          <div className="text-destructive text-sm mt-1 whitespace-pre-line">
            {error || storeErrors[field.name]}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(MultiImageField);
