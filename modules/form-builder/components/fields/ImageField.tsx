import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { FieldConfig } from "../../types/formTypes";
import { cn } from "@/lib/utils";
import { useFormInstance } from "../../hooks/useFormStore";
import { UploadCloud, X } from "lucide-react";
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
  formId = "default",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations("FormBuilder.Fields.Image");

  const formInstance = useFormInstance(formId);
  const storeErrors = formInstance.errors || {};
  const hasStoreError = !!storeErrors[field.name];
  const hasLocalError = !!error && touched;
  const showError = hasLocalError || hasStoreError;

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    if (typeof value === "string") {
      setPreview(value);
    } else if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [value]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (
        field.imageConfig?.allowedFileTypes &&
        !field.imageConfig.allowedFileTypes.includes(file.type)
      ) {
        formInstance.setError(
          field.name,
          `${t(
            "FileTypeNotAllowed"
          )}: ${field.imageConfig.allowedFileTypes.join(", ")}`
        );
        return;
      }

      if (
        field.imageConfig?.maxFileSize &&
        file.size > field.imageConfig.maxFileSize
      ) {
        const maxSizeMB =
          Math.round((field.imageConfig.maxFileSize / (1024 * 1024)) * 10) / 10;
        formInstance.setError(
          field.name,
          `${t("FileSizeExceeds")} (${maxSizeMB} MB)`
        );
        return;
      }

      if (field.imageConfig?.uploadUrl) {
        uploadFile(file);
      } else {
        onChange(file);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [field, onChange, formInstance, t]
  );

  const uploadFile = useCallback(
    async (file: File) => {
      if (!field.imageConfig?.uploadUrl) return;

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              const imageUrl =
                response.url || response.data?.url || response.imageUrl;
              if (imageUrl) {
                onChange(imageUrl);
              } else {
                formInstance.setError(
                  field.name,
                  `${t("UploadSuccessful")} ${t("UploadFailed")}`
                );
              }
            } catch {
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

        xhr.onerror = () => {
          formInstance.setError(field.name, t("UploadFailed"));
          setIsUploading(false);
        };

        xhr.open("POST", field.imageConfig.uploadUrl);

        if (field.imageConfig.uploadHeaders) {
          Object.entries(field.imageConfig.uploadHeaders).forEach(
            ([key, value]) => {
              xhr.setRequestHeader(key, value);
            }
          );
        }

        xhr.send(formData);
      } catch {
        formInstance.setError(field.name, t("UploadFailed"));
        setIsUploading(false);
      }
    },
    [field, onChange, formInstance, t]
  );

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemoveImage = useCallback(() => {
    onChange(null);
    formInstance.setError(field.name, null);
  }, [onChange, formInstance, field.name]);

  return (
    <div className="p-4 bg-[#1b103d] rounded-lg text-white">
      <input
        ref={fileInputRef}
        type="file"
        accept={field.imageConfig?.allowedFileTypes?.join(",") || "image/*"}
        className="hidden"
        onChange={handleFileChange}
        onBlur={onBlur}
      />

      {/* Upload Section */}
      {!preview && (
        <div
          onClick={handleUploadClick}
          className="flex flex-col items-center justify-center cursor-pointer bg-[#28175a] rounded-lg p-6 hover:bg-[#32206b] transition-colors"
          style={{
            width: field.imageConfig?.previewWidth || "100%",
            height: field.imageConfig?.previewHeight || "200px",
          }}
        >
          <UploadCloud className="h-16 w-16 text-pink-400 mb-2" />
          <div className="text-center text-sm">
            {isUploading
              ? `${t("Uploading")} ${uploadProgress}%`
              : t("ClickToUpload")}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {field.imageConfig?.allowedFileTypes &&
              `${t("AllowedTypes")}: ${field.imageConfig.allowedFileTypes
                .map((type) => type.replace("image/", ""))
                .join(", ")}`}
            <br />
            {field.imageConfig?.maxFileSize &&
              `${t("MaxSize")}: ${
                Math.round(
                  (field.imageConfig.maxFileSize / (1024 * 1024)) * 10
                ) / 10
              } MB`}
          </div>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="relative mb-4">
          <img
            src={preview}
            alt="Preview"
            className="rounded-lg w-full h-auto object-cover"
            style={{
              maxHeight: field.imageConfig?.previewHeight || 300,
            }}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Upload / Change button */}
      <Button
        type="button"
        className="w-full mt-4 bg-pink-500 hover:bg-pink-600"
        onClick={handleUploadClick}
        disabled={isUploading}
      >
        {isUploading
          ? `${t("Uploading")}...`
          : preview
          ? t("ChangeImage")
          : t("UploadImage")}
      </Button>

      {/* Error message */}
      {showError && (
        <div className="text-red-500 text-sm mt-2">
          {error || storeErrors[field.name]}
        </div>
      )}
    </div>
  );
};

export default memo(ImageField);
