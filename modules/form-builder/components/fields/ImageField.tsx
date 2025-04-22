import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { FieldConfig } from "../../types/formTypes";
import { cn } from "@/lib/utils";
import { useFormInstance } from "../../hooks/useFormStore";
import { XCircle, Upload, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";

interface ImageFieldProps {
  field: FieldConfig;
  value: File | string | null;
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange: (value: File | string | null) => void;
  onBlur: () => void;
  formId?: string;
}

const ImageField: React.FC<ImageFieldProps> = ({
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
  
  // State for image preview
  const [preview, setPreview] = useState<string | null>(null);
  
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
  
  // Generate preview when value changes
  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    
    if (typeof value === 'string') {
      // If value is a URL string, use it directly as preview
      setPreview(value);
    } else if (value instanceof File) {
      // If value is a File object, create a preview URL
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      
      // Clean up the URL when component unmounts or value changes
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [value]);
  
  // Handle file selection
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type if allowedFileTypes is specified
    if (field.imageConfig?.allowedFileTypes &&
        !field.imageConfig.allowedFileTypes.includes(file.type)) {
      formInstance.setError(field.name, `${t('FileTypeNotAllowed')}: ${field.imageConfig.allowedFileTypes.join(', ')}`);
      return;
    }
    
    // Validate file size if maxFileSize is specified
    if (field.imageConfig?.maxFileSize && file.size > field.imageConfig.maxFileSize) {
      const maxSizeMB = Math.round(field.imageConfig.maxFileSize / (1024 * 1024) * 10) / 10;
      formInstance.setError(field.name, `${t('FileSizeExceeds')} (${maxSizeMB} MB)`);
      return;
    }
    
    // If uploadUrl is provided, upload the file
    if (field.imageConfig?.uploadUrl) {
      uploadFile(file);
    } else {
      // Otherwise, just update the value
      onChange(file);
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [field, onChange, formInstance]);
  
  // Handle image upload
  const uploadFile = useCallback(async (file: File) => {
    if (!field.imageConfig?.uploadUrl) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
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
            // Assuming the response contains a URL to the uploaded image
            const imageUrl = response.url || response.data?.url || response.imageUrl;
            if (imageUrl) {
              onChange(imageUrl);
            } else {
              formInstance.setError(field.name, `${t('UploadSuccessful')} ${t('UploadFailed')}`);
            }
          } catch (error) {
            formInstance.setError(field.name, t('UploadFailed'));
          }
        } else {
          formInstance.setError(field.name, `${t('UploadFailed')} (${xhr.status})`);
        }
        setIsUploading(false);
      };
      
      // Handle errors
      xhr.onerror = () => {
        formInstance.setError(field.name, t('UploadFailed'));
        setIsUploading(false);
      };
      
      // Open and send the request
      xhr.open('POST', field.imageConfig.uploadUrl);
      
      // Add custom headers if provided
      if (field.imageConfig.uploadHeaders) {
        Object.entries(field.imageConfig.uploadHeaders).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      }
      
      xhr.send(formData);
    } catch (error) {
      formInstance.setError(field.name, t('UploadFailed'));
      setIsUploading(false);
    }
  }, [field, onChange, formInstance]);
  
  // Handle removing the image
  const handleRemoveImage = useCallback(() => {
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
          accept={field.imageConfig?.allowedFileTypes?.join(',') || 'image/*'}
          className="hidden"
          onChange={handleFileChange}
          onBlur={onBlur}
        />
        
        {/* Image preview */}
        {preview ? (
          <div className="relative mb-2">
            <div 
              className={cn(
                "relative border rounded-md overflow-hidden",
                showError ? "border-destructive" : "border-input"
              )}
              style={{
                width: field.imageConfig?.previewWidth || 200,
                height: field.imageConfig?.previewHeight || 200
              }}
            >
              <img
                src={preview}
                alt="Preview"
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-colors"
                aria-label={t('RemoveImage')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div 
            className={cn(
              "flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 mb-2 cursor-pointer hover:bg-muted/50 transition-colors",
              showError ? "border-destructive" : "border-input",
              field.imageConfig?.previewWidth ? `w-[${field.imageConfig.previewWidth}px]` : "w-full",
              field.imageConfig?.previewHeight ? `h-[${field.imageConfig.previewHeight}px]` : "h-[200px]"
            )}
            onClick={handleUploadClick}
          >
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {isUploading ? `${t('Uploading')} ${uploadProgress}%` : t('ClickToUpload')}
            </p>
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
        )}
        
        {/* Upload/Change button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "flex items-center",
            field.imageConfig?.previewWidth ? `w-[${field.imageConfig.previewWidth}px]` : "w-full"
          )}
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
              {t('Uploading')}
            </>
          ) : preview ? (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {t('ChangeImage')}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {t('UploadImage')}
            </>
          )}
        </Button>
        
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

export default memo(ImageField);