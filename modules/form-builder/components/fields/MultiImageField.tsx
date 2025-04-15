import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { FieldConfig } from "../../types/formTypes";
import { cn } from "@/lib/utils";
import { useFormInstance } from "../../hooks/useFormStore";
import { XCircle, Upload, Image as ImageIcon, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { apiClient } from "@/config/axios-config"; // Import apiClient

interface MultiImageFieldProps {
  field: FieldConfig;
  value: Array<File | string> | null;
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange: (value: Array<File | string> | null) => void;
  onBlur: () => void;
  formId?: string;
}

// Potential Future Enhancements:
// - Direct-to-cloud storage uploads (e.g., S3 presigned URLs), potentially uploading in parallel.
// - More robust progress indication for individual images and overall batch progress.
// - Client-side image manipulation (resizing, cropping) before uploading.
// - Consider using a dedicated upload library (e.g., Uppy) for advanced features like resumable uploads, drag-and-drop improvements, etc.

interface ImageInfo {
  id: string;
  url: string;
  progress?: number;
  isUploading?: boolean;
  file?: File | string; // Store original file/url reference
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

  // State for image previews and upload status/progress
  const [imageInfos, setImageInfos] = useState<ImageInfo[]>([]);
  const [overallUploadProgress, setOverallUploadProgress] = useState<number | null>(null); // State for overall progress

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

  // Generate image info (including previews) when value changes
  useEffect(() => {
    const objectUrlsToRevoke: string[] = [];

    const newImageInfos = normalizedValue.map((item, index) => {
      // Check if this item already exists in imageInfos (to preserve upload state)
      const existingInfo = imageInfos.find(info => {
        if (typeof item === 'string' && typeof info.file === 'string') return item === info.file;
        if (item instanceof File && info.file instanceof File) return item.name === info.file.name && item.size === info.file.size;
        return false;
      });

      if (existingInfo) return existingInfo; // Preserve existing info

      let previewUrl = '';
      if (typeof item === 'string') {
        previewUrl = item;
      } else if (item instanceof File) {
        previewUrl = URL.createObjectURL(item);
        objectUrlsToRevoke.push(previewUrl);
      }

      return {
        id: `image-${Date.now()}-${index}`,
        url: previewUrl,
        file: item,
        isUploading: false,
        progress: undefined
      };
    });

    setImageInfos(newImageInfos);

    // Clean up previously created object URLs
    return () => {
      objectUrlsToRevoke.forEach(url => URL.revokeObjectURL(url));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedValue]); // Only depend on normalizedValue

  // Define uploadFiles first
  const uploadFiles = useCallback(async (files: File[]) => {
    if (!field.imageConfig?.uploadUrl) return;

    setOverallUploadProgress(0); // Initialize overall progress

    // Create temporary image info objects for the uploading files
    const uploadingImageInfos = files.map((file, index) => {
      const previewUrl = URL.createObjectURL(file); // Create preview immediately
      return {
        id: `uploading-${Date.now()}-${index}`,
        url: previewUrl,
        file: file,
        isUploading: true,
        progress: 0
      };
    });

    // Add the uploading images to the state
    setImageInfos(prev => [...prev, ...uploadingImageInfos]);

    // Upload each file and track overall progress
    const individualProgress: { [key: string]: number } = {};
    uploadingImageInfos.forEach(f => individualProgress[f.id] = 0);

    const uploadPromises = files.map((file, fileIndex) => {
      return new Promise<string>(async (resolve, reject) => { // Make inner function async
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await apiClient.post(field.imageConfig!.uploadUrl!, formData, { // Added non-null assertions
            headers: {
              'Content-Type': 'multipart/form-data',
              ...(field.imageConfig!.uploadHeaders || {}),
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                // Update individual and overall progress
                individualProgress[uploadingImageInfos[fileIndex].id] = progress;
                const totalProgressSum = Object.values(individualProgress).reduce((sum, p) => sum + p, 0);
                const calculatedOverallProgress = Math.round(totalProgressSum / files.length);
                setOverallUploadProgress(calculatedOverallProgress);
                // Update UI state for the specific image
                setImageInfos(prev => prev.map(imgInfo =>
                  imgInfo.id === uploadingImageInfos[fileIndex].id
                    ? { ...imgInfo, progress: progress }
                    : imgInfo
                ));
              }
            },
          });

          // Process successful response
          const imageUrl = response.data?.url || response.data?.data?.url || response.data?.imageUrl;
          if (imageUrl && typeof imageUrl === 'string') {
            resolve(imageUrl);
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
        if (result.status === 'fulfilled') {
          uploadedUrls.push(result.value);
        } else {
          console.error(`Upload failed for ${files[index].name}:`, result.reason);
          failedUploads.push(files[index].name);
          // Optionally update the specific imageInfo state to show an error indicator
          setImageInfos(prev => prev.map(f =>
            f.id === uploadingImageInfos[index].id
              ? { ...f, isUploading: false, progress: undefined /*, error: 'Failed' */ }
              : f
          ));
        }
      });

      // Update image info state after all uploads are settled (remove progress)
      setImageInfos(prev => {
        const finalImageInfos = prev.map(imgInfo => {
          const uploadingInfoIndex = uploadingImageInfos.findIndex(uf => uf.id === imgInfo.id);
          if (uploadingInfoIndex !== -1) {
            // This image was part of the upload batch
            const result = results[uploadingInfoIndex];
            if (result.status === 'fulfilled') {
              // Successfully uploaded: update URL, clear upload state
              // Revoke the temporary blob URL before updating
              URL.revokeObjectURL(imgInfo.url);
              return { ...imgInfo, url: result.value, file: result.value, isUploading: false, progress: undefined };
            } else {
              // Failed upload: clear upload state, keep temporary blob URL for preview
              return { ...imgInfo, isUploading: false, progress: undefined /*, error: 'Upload Failed' */ };
            }
          }
          return imgInfo; // Keep images not part of this batch
        });

        // Optionally filter out images that failed to upload
        // return finalImageInfos.filter(imgInfo => !(imgInfo.error === 'Upload Failed'));
        return finalImageInfos;
      });

      // If at least one image was uploaded successfully
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
      console.error('Upload processing error:', error);
      formInstance.setError(field.name, t('UploadFailed'));
      // Ensure uploading state is cleared even if processing fails
      setImageInfos(prev => prev.map(f => uploadingImageInfos.some(uf => uf.id === f.id) ? { ...f, isUploading: false, progress: undefined } : f));
    } finally {
      setOverallUploadProgress(null); // Reset overall progress
    }
  }, [field, onChange, formInstance, value, t, normalizedValue]); // Added t and normalizedValue

  // Handle file selection (now defined after uploadFiles)
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
    } else {
       // Clear previous errors if all selected files are valid
       formInstance.setError(field.name, null);
    }

    // If uploadUrl is provided, upload the files
    if (field.imageConfig?.uploadUrl) {
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

  // Handle removing an image
  const handleRemoveImage = useCallback((index: number) => {
    const imageInfoToRemove = imageInfos[index];
    if (!imageInfoToRemove) return;

    // Filter the main value array
    const newValue = normalizedValue.filter((item, i) => i !== index);

    // Revoke object URL if it was a File preview
    if (imageInfoToRemove.file instanceof File) {
      URL.revokeObjectURL(imageInfoToRemove.url);
    }

    // Update state
    onChange(newValue.length === 0 ? [] : newValue);

    // Clear any errors
    formInstance.setError(field.name, null);
  }, [onChange, formInstance, field.name, normalizedValue, imageInfos]); // Added imageInfos

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
          accept={field.imageConfig?.allowedFileTypes?.join(',') || 'image/*'}
          className="hidden"
          onChange={handleFileChange}
          onBlur={onBlur}
          multiple={true} // Always allow multiple files
        />

        {/* Image previews */}
        {imageInfos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
            {imageInfos.map((imgInfo, index) => (
              <div key={imgInfo.id} className="relative aspect-square">
                <div
                  className={cn(
                    "relative border rounded-md overflow-hidden w-full h-full group",
                    showError && !imgInfo.isUploading ? "border-destructive" : "border-input" // Show border only if not uploading
                  )}
                >
                  <img
                    src={imgInfo.url}
                    alt={`Preview ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  {/* Remove Button */}
                  {!imgInfo.isUploading && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-black bg-opacity-40 rounded-full p-0.5 text-white opacity-0 group-hover:opacity-100 hover:bg-opacity-60 transition-opacity"
                      aria-label={t('RemoveImage')}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  {/* Upload Progress Overlay */}
                  {imgInfo.isUploading && imgInfo.progress !== undefined && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center flex-col text-white p-1">
                      <div className="w-full bg-gray-600 rounded-full h-1.5 mb-1">
                        <div
                          className="bg-white h-1.5 rounded-full"
                          style={{ width: `${imgInfo.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{imgInfo.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

          </div>
        ) : null}

        {/* Upload area / Add More Button */}
        <div
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 mb-4 cursor-pointer hover:bg-muted/50 transition-colors",
            showError ? "border-destructive" : "border-input"
          )}
          onClick={handleUploadClick}
          style={{
            width: "100%",
            minHeight: "100px", // Reduced height
          }}
        >
          {overallUploadProgress !== null ? (
            <>
              <div className="animate-spin h-8 w-8 border-2 border-current border-t-transparent rounded-full text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {t('Uploading')} {overallUploadProgress}%
              </p>
            </>
          ) : imageInfos.length > 0 ? (
            <>
              <Plus className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {t('AddMoreImages')}
              </p>
            </>
          ) : (
            <>
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {t('ClickToUploadMultiple')}
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

        {/* Overall Upload progress (moved below upload area) */}
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